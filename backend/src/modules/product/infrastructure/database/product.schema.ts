import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
class ProductCreator {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  fullname: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  email: string;
}

@Schema({
  collection: 'products',
  timestamps: true,
})
export class Product {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String })
  video?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  brand: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String })
  size?: string;

  @Prop({ type: String })
  weight?: string;

  @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: String })
  warranty_period?: string;

  @Prop({ type: String })
  business_phone?: string;

  @Prop({ type: String })
  voltage?: string;

  @Prop({ type: [String] })
  features: string[];

  @Prop({ type: Number, default: 0 })
  quantity: number;

  @Prop({ type: ProductCreator, required: true })
  creator: ProductCreator;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
