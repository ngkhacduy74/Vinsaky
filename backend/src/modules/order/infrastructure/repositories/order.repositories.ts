import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Order, OrderDocument } from '../database/order.schema';
import {
  CreateOrderDto,
  CreateOrderItemDto,
} from '../../presentation/dto/req/create-order.dto';
import { OrderRepoAbstract } from 'src/modules/order/domain/repositories/order.repositories';
import { OrderEntity } from 'src/modules/order/domain/entities/order.entity';
import { OrderSearchQuery, SortQuery } from 'src/common/interfaces/query.interface';
import { MongoQueryTransformer } from 'src/common/infrastructure/database/query-transformer';

@Injectable()
export class OrderRepository implements OrderRepoAbstract {
  constructor(
    @InjectModel(Order.name) private readonly model: Model<OrderDocument>,
  ) {}

  async startTransactionSession(): Promise<ClientSession> {
    return await this.model.db.startSession();
  }

  async createOrder(
    userId: string | undefined,
    dto: CreateOrderDto,
    invoice: string,
    total_prices: number,
    session?: ClientSession,
  ): Promise<OrderEntity[]> {
    const documents = await this.model.create(
      [
        {
          user_id: userId || 'GUEST',
          shipping: dto.shipping,
          items: dto.items,
          total: total_prices,
          status: 'pending',
          sepay: { orderInvoiceNumber: invoice, status: 'pending' },
        },
      ],
      session ? { session } : undefined,
    );
    return documents.map((doc) => this.mapToDomain(doc));
  }

  async findByInvoice(invoice: string): Promise<OrderEntity | null> {
    const document = await this.model.findOne({
      'sepay.orderInvoiceNumber': invoice,
    });
    return document ? this.mapToDomain(document) : null;
  }

  async findOrders(
    query: OrderSearchQuery,
    skip: number,
    limit: number,
    sort: SortQuery,
  ): Promise<OrderEntity[]> {
    const mongoQuery = MongoQueryTransformer.transformOrderSearchQuery(query);
    const mongoSort = MongoQueryTransformer.transformSortQuery(sort);

    const documents = await this.model
      .find(mongoQuery)
      .sort(mongoSort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return documents.map((doc) => this.mapToDomain(doc));
  }

  async countOrders(query: OrderSearchQuery): Promise<number> {
    const mongoQuery = MongoQueryTransformer.transformOrderSearchQuery(query);
    return this.model.countDocuments(mongoQuery);
  }

  async markPaid(
    invoice: string,
    transactionId?: string,
    raw?: any,
  ): Promise<void> {
    const result = await this.model.updateOne(
      {
        'sepay.orderInvoiceNumber': invoice,
        status: { $ne: 'paid' }, // Only update if not already paid
      },
      {
        $set: {
          status: 'paid',
          'sepay.status': 'paid',
          'sepay.transactionId': transactionId,
          'sepay.paidAt': new Date(),
          'sepay.ipnRaw': raw,
        },
      },
    );
    // If no document was modified, it means the order was already paid
    // This makes the operation idempotent
  }

  async checkTotal(items: CreateOrderItemDto[]): Promise<number> {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  async markEmailSent(
    invoice: string,
    session?: ClientSession,
  ): Promise<boolean> {
    const result = await this.model.updateOne(
      { 'sepay.orderInvoiceNumber': invoice, emailSentAt: { $exists: false } },
      { $set: { emailSentAt: new Date() } },
      session ? { session } : undefined,
    );
    return result.modifiedCount > 0;
  }

  private mapToDomain(document: any): OrderEntity {
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

  private mapToPersistence(entity: Partial<OrderEntity>): Partial<Order> {
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
