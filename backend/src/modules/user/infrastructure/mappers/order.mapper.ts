import { OrderResponseDto } from 'src/modules/order/presentation/dto/res/order.dto';
import { IOrder } from 'src/modules/order/domain/interfaces/order.interface';

export class OrderMapper {
  static toResponseDto(order: IOrder): OrderResponseDto {
    return {
      id: String((order as any)._id),
      user_id: order.user_id,
      status: order.status as any,
      total: order.total,
      shipping: order.shipping,
      items: order.items,
      sepay: {
        orderInvoiceNumber: order.sepay.orderInvoiceNumber,
        status: order.sepay.status,
        transactionId: order.sepay.transactionId,
        paidAt: order.sepay.paidAt
          ? order.sepay.paidAt.toISOString()
          : undefined,
      },
      createdAt: order.createdAt
        ? order.createdAt.toISOString()
        : new Date().toISOString(),
      updatedAt: order.updatedAt
        ? order.updatedAt.toISOString()
        : order.createdAt
          ? order.createdAt.toISOString()
          : new Date().toISOString(),
    };
  }

  static toResponseDtoList(orders: IOrder[]): OrderResponseDto[] {
    return orders.map(order => this.toResponseDto(order));
  }
}
