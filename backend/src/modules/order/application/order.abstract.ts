import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CreateOrderDto } from 'src/modules/order/presentation/dto/req/create-order.dto';
import { OrderResponseDto } from 'src/modules/order/presentation/dto/res/order.dto';
import { SepayCheckoutResponseDto } from 'src/modules/order/presentation/dto/res/sepay-checkout-response.dto';

export abstract class OrderAbstract {
  abstract checkoutSepay(
    userId: string,
    payload: CreateOrderDto,
  ): Promise<BaseResponseDto<SepayCheckoutResponseDto>>;

  abstract handleSepayIpn(
    headers: Record<string, any>,
    body: any,
  ): Promise<BaseResponseDto<null>>;

  abstract getOrderByInvoice(
    invoice: string,
  ): Promise<BaseResponseDto<OrderResponseDto>>;
}
