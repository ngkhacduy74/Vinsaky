import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { OrderAbstract } from 'src/modules/order/application/order.abstract';
import { CreateOrderDto } from '../presentation/dto/req/create-order.dto';
import { OrderResponseDto } from 'src/modules/order/presentation/dto/res/order.dto';
import { SepayCheckoutResponseDto } from 'src/modules/order/presentation/dto/res/sepay-checkout-response.dto';
import { OrderRepoAbstract } from 'src/modules/order/domain/repositories/order.repositories';
import { ResponseBuilderUtil } from 'src/utils/response-builder.util';
import { OrderDomainService } from '../domain/services/order-domain.service';
import {
  SepayService,
  SepayIpnDto,
} from '../infrastructure/payment/sepay.service';
import { InventoryService } from 'src/modules/order/domain/services/inventory.service';
import { VipService } from 'src/modules/user/domain/services/vip.service';
import { InvoiceService } from 'src/modules/order/domain/services/invoice.service';
import { OrderMapper } from '../infrastructure/mappers/order.mapper';

@Injectable()
export class OrderService implements OrderAbstract {
  constructor(
    private readonly orderRepo: OrderRepoAbstract,
    private readonly sepayService: SepayService,
    private readonly inventoryService: InventoryService,
    private readonly vipService: VipService,
    private readonly orderDomainService: OrderDomainService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async checkoutSepay(
    userId: string,
    payload: CreateOrderDto,
  ): Promise<BaseResponseDto<SepayCheckoutResponseDto>> {
    // 1. Validate order
    this.orderDomainService.validateOrder(payload);

    // 2. Calculate total
    const total = await this.orderDomainService.calculateTotal(payload.items);

    // 3. Reserve stock
    const reserveResult = await this.inventoryService.checkAndReserveStock(
      payload.items,
    );
    if (!reserveResult.ok) {
      throw new BadRequestException(
        `Sản phẩm "${reserveResult.failedItemName}" không đủ số lượng trong kho`,
      );
    }

    // 4. Create order
    const invoice = this.orderDomainService.createInvoice();
    await this.orderRepo.createOrder(userId, payload, invoice, total);

    // 5. Generate payment form
    const html = this.sepayService.generateCheckoutHtml(invoice, total, userId);

    return ResponseBuilderUtil.success('Checkout initiated successfully', {
      invoice,
      html,
    });
  }

  async handleSepayIpn(
    headers: Record<string, any>,
    body: SepayIpnDto,
  ): Promise<BaseResponseDto<null>> {
    // 1. Verify IPN secret
    if (!this.sepayService.verifyIpnSecret(headers)) {
      throw new UnauthorizedException('Invalid IPN secret');
    }

    // 2. Validate IPN body
    const ipnData = this.sepayService.validateIpnBody(body);
    if (!ipnData) {
      throw new BadRequestException('Invalid IPN body');
    }

    const { type, invoice, amount } = ipnData;

    // 3. Handle VIP upgrade invoices
    if (this.invoiceService.isVipUpgradeInvoice(invoice)) {
      const vipProcessed = await this.vipService.handleVipUpgradePayment(
        invoice,
        amount,
      );
      if (vipProcessed) {
        return ResponseBuilderUtil.success(
          'VIP upgrade processed successfully',
          null,
        );
      }
    }

    // 4. Handle regular order invoices with improved idempotency
    const order = await this.orderRepo.findByInvoice(invoice);
    if (!order) throw new BadRequestException('Order not found');

    if (order.isPaid()) {
      return ResponseBuilderUtil.success('Order already paid', null);
    }

    // 5. Validate payment amount
    this.orderDomainService.validatePaymentAmount(order.total, amount);

    if (type === 'ORDER_PAID') {
      await this.orderRepo.markPaid(
        invoice,
        body?.transaction_id || body?.gateway_transaction_id,
        body,
      );
    }

    return ResponseBuilderUtil.success('IPN processed successfully', null);
  }

  async getOrderByInvoice(
    invoice: string,
  ): Promise<BaseResponseDto<OrderResponseDto>> {
    if (!invoice) throw new BadRequestException('Missing invoice');

    const order = await this.orderRepo.findByInvoice(invoice);
    if (!order) throw new BadRequestException('Order not found');

    const responseDto = OrderMapper.toResponseDto(order);
    return ResponseBuilderUtil.success(
      'Get order by invoice successful',
      responseDto,
    );
  }
}
