import { ClientSession } from 'mongoose';
import { OrderEntity } from '../entities/order.entity';
import {
  OrderSearchQuery,
  SortQuery,
} from 'src/common/interfaces/query.interface';

export abstract class OrderRepoAbstract {
  abstract startTransactionSession(): Promise<ClientSession>;
  abstract createOrder(
    userId: string | undefined,
    dto: any,
    invoice: string,
    total_prices: number,
    session?: ClientSession,
  ): Promise<OrderEntity[]>;
  abstract findByInvoice(invoice: string): Promise<OrderEntity | null>;
  abstract findOrders(
    query: OrderSearchQuery,
    skip: number,
    limit: number,
    sort: SortQuery,
  ): Promise<OrderEntity[]>;
  abstract countOrders(query: OrderSearchQuery): Promise<number>;
  abstract markPaid(
    invoice: string,
    transactionId?: string,
    raw?: any,
  ): Promise<void>;
  abstract checkTotal(items: any[]): Promise<number>;
  abstract markEmailSent(
    invoice: string,
    session?: ClientSession,
  ): Promise<boolean>;
}
