import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
class OrderSepay {
  @Prop({ type: String, required: true })
  orderInvoiceNumber: string;

  @Prop({ type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' })
  status: string;

  @Prop({ type: String })
  transactionId?: string;

  @Prop({ type: Date })
  paidAt?: Date;

  @Prop({ type: Object })
  ipnRaw?: any;
}

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: String, required: true })
  product_id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  quantity: number;
}

@Schema({ _id: false })
class OrderShipping {
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  addressDetail: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  note?: string;
}

@Schema({
  collection: 'orders',
  timestamps: true,
})
export class Order {
  @Prop({ type: String, required: true })
  user_id: string;

  @Prop({ type: OrderShipping, required: true })
  shipping: OrderShipping;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' })
  status: string;

  @Prop({ type: OrderSepay, required: true })
  sepay: OrderSepay;

  @Prop({ type: Date })
  emailSentAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
