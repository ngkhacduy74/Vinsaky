import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IMailRepository } from '../domain/repositories/mail.repository';
import { MailEntity, MailType } from '../domain/entities/mail.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailRepository: IMailRepository,
  ) {}

  async sendMail(to: string, subject: string, html: string, type: MailType) {
    // 1. Create domain entity (pending status)
    let mail = MailEntity.create({
      receiver: to,
      subject,
      content: html,
      type,
    });

    // 2. Persist initial state
    mail = await this.mailRepository.save(mail);

    try {
      // 3. Setup transporter
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: Number(process.env.MAIL_PORT) === 465,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      // 4. Send email
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
      });

      // 5. Update domain state to SENT
      mail = mail.markAsSent();
      await this.mailRepository.save(mail);

      return {
        success: true,
        message: 'Đã gửi email thành công',
        mailId: mail.id,
      };
    } catch (error: any) {
      // 6. Update domain state to FAILED
      mail = mail.markAsFailed();
      await this.mailRepository.save(mail);
      
      throw new InternalServerErrorException({
        message: 'Gửi email thất bại',
        error: error.message,
      });
    }
  }
}
