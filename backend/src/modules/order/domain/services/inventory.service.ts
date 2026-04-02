import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/modules/product/infrastructure/repositories/product.repositories';
import { CreateOrderItemDto } from '../../presentation/dto/req/create-order.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly productRepo: ProductRepository) {}

  async checkAndReserveStock(
    items: CreateOrderItemDto[],
  ): Promise<{ ok: true } | { ok: false; failedItemName: string }> {
    return await this.productRepo.checkAndReserveStock(items);
  }

  calculateTotal(items: CreateOrderItemDto[]): number {
    if (!items || items.length === 0) {
      throw new Error('No items to calculate total');
    }

    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
