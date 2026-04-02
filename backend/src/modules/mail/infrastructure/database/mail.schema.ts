import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MailType, MailStatus } from '../../domain/entities/mail.entity';

export type MailDocument = Mail & Document;

@Schema({
  collection: 'mails',
  timestamps: { createdAt: 'created_at', updatedAt: false },
})
export class Mail {
  @Prop({ type: String, required: true })
  receiver: string;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({
    type: String,
    enum: Object.values(MailType),
    required: true,
  })
  type: MailType;

  @Prop({
    type: String,
    enum: Object.values(MailStatus),
    default: MailStatus.PENDING,
  })
  status: MailStatus;

  @Prop({ type: Date })
  sent_at?: Date;
}

export const MailSchema = SchemaFactory.createForClass(Mail);
