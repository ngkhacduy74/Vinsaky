import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerProductDocument = BannerProduct & Document;

@Schema({
  collection: 'banner_products',
  timestamps: true,
})
export class BannerProduct {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  category?: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  price: string;

  @Prop({ type: String })
  discount?: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  badge: string;

  @Prop({ type: String })
  buttonText?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const BannerProductSchema = SchemaFactory.createForClass(BannerProduct);

export type BannerProductIdsDocument = BannerProductIds & Document;

@Schema({
  collection: 'banner_product_ids',
  timestamps: true,
})
export class BannerProductIds {
  @Prop({ type: [String], required: true })
  productIds: string[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 10 })
  maxProducts: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const BannerProductIdsSchema =
  SchemaFactory.createForClass(BannerProductIds);
