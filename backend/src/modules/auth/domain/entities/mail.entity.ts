export enum MailType {
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  ORDER_CONFIRMATION = 'order_confirmation',
  VIP_UPGRADE = 'vip_upgrade',
  GENERAL = 'general',
}

export interface MailData {
  to: string;
  subject: string;
  html: string;
  type: MailType;
}

export class MailEntity {
  constructor(
    public readonly to: string,
    public readonly subject: string,
    public readonly html: string,
    public readonly type: MailType,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(data: MailData): MailEntity {
    return new MailEntity(data.to, data.subject, data.html, data.type);
  }
}
