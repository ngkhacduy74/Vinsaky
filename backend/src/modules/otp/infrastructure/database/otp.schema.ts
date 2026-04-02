import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({
  collection: 'otps',
  timestamps: { createdAt: 'created_at', updatedAt: false },
})
export class Otp {
  @Prop({ type: String, required: true })
  receiver: string;

  @Prop({ type: String, required: true })
  otp: string;

  @Prop({ type: Date, required: true })
  expired_at: Date;

  @Prop({ type: Boolean, default: false })
  is_used: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
