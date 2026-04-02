import { MailEntity, MailType } from '../entities/mail.entity';

export abstract class MailRepositoryAbstract {
  abstract sendMail(to: string, subject: string, html: string, type: MailType): Promise<void>;
  abstract saveMail(mail: MailEntity): Promise<void>;
  abstract getMailHistory(email: string, limit?: number): Promise<MailEntity[]>;
}
