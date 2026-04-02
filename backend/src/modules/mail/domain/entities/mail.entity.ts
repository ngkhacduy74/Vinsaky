export enum MailType {
  WELCOME = 'Welcome',
  THANK_YOU = 'THANK_YOU',
  REMIND = 'REMIND',
  ORDER_PAID = 'ORDER_PAID',
  UPGRADE_VIP = 'UPGRADE_VIP',
}

export enum MailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export class MailEntity {
  constructor(
    public readonly id: string | undefined,
    public readonly receiver: string,
    public readonly subject: string,
    public readonly content: string,
    public readonly type: MailType,
    public readonly status: MailStatus,
    public readonly sent_at?: Date,
    public readonly created_at?: Date,
  ) {}

  static create(data: {
    receiver: string;
    subject: string;
    content: string;
    type: MailType;
    status?: MailStatus;
  }): MailEntity {
    return new MailEntity(
      undefined,
      data.receiver,
      data.subject,
      data.content,
      data.type,
      data.status || MailStatus.PENDING,
      undefined,
      new Date(),
    );
  }

  markAsSent(): MailEntity {
    return new MailEntity(
      this.id,
      this.receiver,
      this.subject,
      this.content,
      this.type,
      MailStatus.SENT,
      new Date(),
      this.created_at,
    );
  }

  markAsFailed(): MailEntity {
    return new MailEntity(
      this.id,
      this.receiver,
      this.subject,
      this.content,
      this.type,
      MailStatus.FAILED,
      this.sent_at,
      this.created_at,
    );
  }
}
