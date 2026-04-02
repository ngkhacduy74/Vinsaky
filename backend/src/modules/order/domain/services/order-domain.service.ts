import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OrderDomainService {
  validateOrder(payload: any): void {
    if (!payload?.items || payload.items.length === 0) {
      throw new BadRequestException('Thiếu thông tin sản phẩm');
    }
    if (!payload?.shipping?.email) {
      throw new BadRequestException('Thiếu email');
    }
    if (
      !payload?.shipping?.fullName ||
      !payload?.shipping?.phone ||
      !payload?.shipping?.addressDetail
    ) {
      throw new BadRequestException('Thiếu thông tin giao hàng');
    }
  }

  async calculateTotal(items: any[]): Promise<number> {
    if (!items || items.length === 0) {
      throw new BadRequestException('Không có sản phẩm để tính tổng');
    }
    
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    if (!Number.isFinite(total) || total <= 0) {
      throw new BadRequestException('Không lấy được giá tiền sản phẩm');
    }
    
    return total;
  }

  validatePaymentAmount(orderTotal: number, paymentAmount: number): void {
    if (Number(orderTotal) !== paymentAmount) {
      throw new BadRequestException('Amount mismatch');
    }
  }

  createInvoice(): string {
    return `INV-${Date.now()}`;
  }
}
