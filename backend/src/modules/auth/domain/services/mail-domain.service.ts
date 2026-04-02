import { Injectable } from '@nestjs/common';
import { MailEntity, MailType } from '../entities/mail.entity';

@Injectable()
export class MailDomainService {
  generateWelcomeEmail(email: string, fullname: string): MailEntity {
    const subject = 'Chào mừng bạn đến với hệ thống!';
    const html = `
      <h2>Chào ${fullname},</h2>
      <p>Chào mừng bạn đã đăng ký tài khoản thành công!</p>
      <p>Bây giờ bạn có thể sử dụng các dịch vụ của chúng tôi.</p>
    `;
    
    return MailEntity.create({
      to: email,
      subject,
      html,
      type: MailType.WELCOME
    });
  }

  generatePasswordResetEmail(email: string, resetToken: string): MailEntity {
    const subject = 'Đặt lại mật khẩu';
    const html = `
      <h2>Đặt lại mật khẩu</h2>
      <p>Vui lòng sử dụng mã sau để đặt lại mật khẩu:</p>
      <p><strong>${resetToken}</strong></p>
      <p>Mã này sẽ hết hạn sau 15 phút.</p>
    `;
    
    return MailEntity.create({
      to: email,
      subject,
      html,
      type: MailType.PASSWORD_RESET
    });
  }

  generateOrderConfirmationEmail(email: string, orderInfo: any): MailEntity {
    const subject = 'Xác nhận đơn hàng';
    const html = `
      <h2>Xác nhận đơn hàng #${orderInfo.invoice}</h2>
      <p>Cảm ơn bạn đã đặt hàng!</p>
      <p>Tổng tiền: ${orderInfo.total} VNĐ</p>
      <p>Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.</p>
    `;
    
    return MailEntity.create({
      to: email,
      subject,
      html,
      type: MailType.ORDER_CONFIRMATION
    });
  }

  generateVipUpgradeEmail(email: string, fullname: string): MailEntity {
    const subject = 'Nâng cấp tài khoản VIP thành công';
    const html = `
      <h2>Chúc mừng ${fullname}!</h2>
      <p>Tài khoản của bạn đã được nâng cấp lên VIP thành công.</p>
      <p>Bạn hiện có thể đăng bài không giới hạn.</p>
    `;
    
    return MailEntity.create({
      to: email,
      subject,
      html,
      type: MailType.VIP_UPGRADE
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateMailContent(subject: string, html: string): boolean {
    return !!(subject && subject.trim() && html && html.trim());
  }
}
