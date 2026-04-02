export interface ShippingInfo {
  fullName: string;
  phone: string;
  addressDetail: string;
  email: string;
  note?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SepayInfo {
  orderInvoiceNumber: string;
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  paidAt?: Date;
  ipnRaw?: Record<string, any>;
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export class OrderEntity {
  id?: string;
  user_id: string;
  shipping: ShippingInfo;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  sepay: SepayInfo;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<OrderEntity>) {
    Object.assign(this, partial);
  }

  static create(data: Partial<OrderEntity>): OrderEntity {
    return new OrderEntity(data);
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  isPaid(): boolean {
    return this.status === OrderStatus.PAID;
  }

  isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  isFailed(): boolean {
    return this.status === OrderStatus.FAILED;
  }

  isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }
}
