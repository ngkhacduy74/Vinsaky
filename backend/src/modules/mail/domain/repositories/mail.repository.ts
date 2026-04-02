import { MailEntity } from '../entities/mail.entity';

export abstract class IMailRepository {
  abstract save(mail: MailEntity): Promise<MailEntity>;
  abstract findById(id: string): Promise<MailEntity | null>;
  abstract findByReceiver(receiver: string): Promise<MailEntity[]>;
  abstract findPending(): Promise<MailEntity[]>;
}
