import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mail, MailDocument } from '../database/mail.schema';
import { IMailRepository } from '../../domain/repositories/mail.repository';
import { MailEntity, MailType, MailStatus } from '../../domain/entities/mail.entity';

@Injectable()
export class MailRepository implements IMailRepository {
  constructor(
    @InjectModel(Mail.name)
    private readonly mailModel: Model<MailDocument>,
  ) {}

  async save(mail: MailEntity): Promise<MailEntity> {
    const data = this.toPersistence(mail);
    let doc;
    
    if (mail.id) {
      doc = await this.mailModel.findByIdAndUpdate(mail.id, data, { new: true });
    } else {
      doc = await this.mailModel.create(data);
    }
    
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<MailEntity | null> {
    const doc = await this.mailModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByReceiver(receiver: string): Promise<MailEntity[]> {
    const docs = await this.mailModel.find({ receiver }).sort({ created_at: -1 }).exec();
    return docs.map(doc => this.toDomain(doc));
  }

  async findPending(): Promise<MailEntity[]> {
    const docs = await this.mailModel.find({ status: MailStatus.PENDING }).sort({ created_at: 1 }).exec();
    return docs.map(doc => this.toDomain(doc));
  }

  private toDomain(doc: any): MailEntity {
    return new MailEntity(
      doc._id.toString(),
      doc.receiver,
      doc.subject,
      doc.content,
      doc.type as MailType,
      doc.status as MailStatus,
      doc.sent_at,
      doc.created_at,
    );
  }

  private toPersistence(entity: MailEntity): Partial<Mail> {
    return {
      receiver: entity.receiver,
      subject: entity.subject,
      content: entity.content,
      type: entity.type,
      status: entity.status,
      sent_at: entity.sent_at,
    };
  }
}
