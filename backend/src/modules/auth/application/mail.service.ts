import { Injectable } from '@nestjs/common';
import { MailRepositoryAbstract } from '../domain/repositories/mail.repository';
import { MailDomainService } from '../domain/services/mail-domain.service';
import { MailEntity, MailType } from '../domain/entities/mail.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailRepository: MailRepositoryAbstract,
    private readonly mailDomainService: MailDomainService
  ) {}

  async sendWelcomeEmail(email: string, fullname: string): Promise<void> {
    const mail = this.mailDomainService.generateWelcomeEmail(email, fullname);
    await this.mailRepository.sendMail(mail.to, mail.subject, mail.html, mail.type);
    await this.mailRepository.saveMail(mail);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const mail = this.mailDomainService.generatePasswordResetEmail(email, resetToken);
    await this.mailRepository.sendMail(mail.to, mail.subject, mail.html, mail.type);
    await this.mailRepository.saveMail(mail);
  }

  async sendOrderConfirmationEmail(email: string, orderInfo: any): Promise<void> {
    const mail = this.mailDomainService.generateOrderConfirmationEmail(email, orderInfo);
    await this.mailRepository.sendMail(mail.to, mail.subject, mail.html, mail.type);
    await this.mailRepository.saveMail(mail);
  }

  async sendVipUpgradeEmail(email: string, fullname: string): Promise<void> {
    const mail = this.mailDomainService.generateVipUpgradeEmail(email, fullname);
    await this.mailRepository.sendMail(mail.to, mail.subject, mail.html, mail.type);
    await this.mailRepository.saveMail(mail);
  }

  async sendCustomEmail(to: string, subject: string, html: string, type: MailType = MailType.GENERAL): Promise<void> {
    if (!this.mailDomainService.validateEmail(to)) {
      throw new Error('Invalid email address');
    }

    if (!this.mailDomainService.validateMailContent(subject, html)) {
      throw new Error('Subject and HTML content are required');
    }

    const mail = MailEntity.create({ to, subject, html, type });
    await this.mailRepository.sendMail(mail.to, mail.subject, mail.html, mail.type);
    await this.mailRepository.saveMail(mail);
  }

  async getMailHistory(email: string, limit?: number): Promise<MailEntity[]> {
    return this.mailRepository.getMailHistory(email, limit);
  }
}
