import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/infrastructure/repositories/user.repositories';
import { MailService } from 'src/modules/auth/application/mail.service';
import { MailType } from 'src/modules/auth/domain/entities/mail.entity';
import { InvoiceService } from '../../../order/domain/services/invoice.service';

@Injectable()
export class VipService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailService: MailService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async handleVipUpgradePayment(
    invoice: string,
    amount: number,
  ): Promise<boolean> {
    if (!this.invoiceService.isVipUpgradeInvoice(invoice)) {
      return false;
    }

    if (amount < 25000) {
      return false;
    }

    const invoiceInfo = this.invoiceService.parse(invoice);
    if (invoiceInfo.type !== 'vip-upgrade' || !invoiceInfo.userId) {
      return false;
    }

    await this.upgradeUserToPremium(invoiceInfo.userId);
    await this.sendVipUpgradeEmail(invoiceInfo.userId);

    return true;
  }

  private async upgradeUserToPremium(userId: string): Promise<void> {
    const user = await this.userRepo.findByUserId(userId);
    if (!user) {
      throw new Error('User not found for VIP upgrade');
    }

    if (!user.canUpgradeToPremium()) {
      throw new Error('User cannot upgrade to premium');
    }

    const upgradedUser = user.upgradeToPremium();
    await this.userRepo.updateByUserId(userId, upgradedUser);
  }

  private async sendVipUpgradeEmail(userId: string): Promise<void> {
    try {
      const user = await this.userRepo.findByUserId(userId);
      if (user && user.email) {
        const subject = 'Nâng cấp tài khoản VIP thành công';
        const html = `<p>Chào ${user.fullname},</p><p>Tài khoản của bạn đã được nâng cấp lên VIP thành công. Bạn hiện có thể đăng bài không giới hạn.</p>`;

        await this.mailService.sendVipUpgradeEmail(
          user.email,
          user.fullname,
        );
      }
    } catch (error) {
      console.error('Send VIP email failed:', error);
      // Don't throw error - email failure shouldn't break the payment process
    }
  }
}
