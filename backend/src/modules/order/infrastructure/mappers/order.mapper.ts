import { OrderEntity } from '../../domain/entities/order.entity';
import {
  Order,
  OrderDocument,
} from 'src/modules/order/infrastructure/entities/order.schema';

export class OrderMapper {
  static toResponseDto(entity: OrderEntity): any {
    return {
      id: entity.id,
      user_id: entity.user_id,
      shipping: entity.shipping,
      items: entity.items,
      total: entity.total,
      status: entity.status,
      sepay: entity.sepay,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toEntity(document: OrderDocument): OrderEntity {
    return new OrderEntity({
      id: document._id?.toString(),
      user_id: document.user_id,
      shipping: document.shipping,
      items: document.items,
      total: document.total,
      status: document.status,
      sepay: document.sepay,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  static toPersistence(entity: OrderEntity): Partial<Order> {
    return {
      user_id: entity.user_id,
      shipping: entity.shipping,
      items: entity.items,
      total: entity.total,
      status: entity.status,
      sepay: entity.sepay,
    };
  }
}
