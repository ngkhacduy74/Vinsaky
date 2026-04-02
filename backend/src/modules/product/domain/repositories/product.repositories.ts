import { ClientSession } from 'mongoose';
import {
  ProductSearchQuery,
  SortQuery,
} from 'src/common/interfaces/query.interface';
import { CreateOrderItemDto } from 'src/modules/order/presentation/dto/req/create-order.dto';
import { ProductEntity } from 'src/modules/product/domain/entities/product.entity';

export abstract class ProductRepoAbstract {
  abstract createProduct(payload: ProductEntity): Promise<ProductEntity>;
  abstract findAllProducts(
    skip: number,
    limit: number,
  ): Promise<ProductEntity[]>;
  abstract countAllProducts(): Promise<number>;
  abstract findByProductId(id: string): Promise<ProductEntity | null>;
  abstract loadAllBrands(): Promise<string[]>;
  abstract updateByProductId(
    id: string,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity | null>;
  abstract deleteByProductId(id: string): Promise<ProductEntity | null>;
  abstract searchProducts(
    query: ProductSearchQuery,
    skip: number,
    limit: number,
    sort: SortQuery,
  ): Promise<ProductEntity[]>;
  abstract countSearchProducts(query: ProductSearchQuery): Promise<number>;
  abstract decrementIfEnough(
    productId: string,
    qty: number,
    session?: ClientSession,
  ): Promise<boolean>;
  abstract checkAndReserveStock(
    items: CreateOrderItemDto[],
    session?: ClientSession,
  ): Promise<{ ok: true } | { ok: false; failedItemName: string }>;
}
