export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface IShippingInfo {
  fullName: string;
  phone: string;
  addressDetail: string;
  email: string;
  note?: string;
}

export interface IOrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ISepayInfo {
  orderInvoiceNumber: string;
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  paidAt?: Date;
  ipnRaw?: Record<string, any>;
}

export interface IOrder {
  user_id: string;

  shipping: IShippingInfo;

  items: IOrderItem[];

  total: number;

  status: OrderStatus;

  sepay: ISepayInfo;

  createdAt?: Date;
  updatedAt?: Date;
}