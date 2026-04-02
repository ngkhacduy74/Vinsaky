import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { IMailRepository } from './domain/repositories/mail.repository';
import { MailRepository } from './infrastructure/repositories/mail.repository';
import { MailService } from './application/mail.service';
import { EmailProcessor } from './infrastructure/mq/mail.processor';
import { Mail, MailSchema } from './infrastructure/database/mail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mail.name, schema: MailSchema }]),
    BullModule.registerQueue({
      name: 'email_queue_bull',
    }),
  ],
  providers: [
    {
      provide: IMailRepository,
      useClass: MailRepository,
    },
    MailService,
    EmailProcessor,
  ],
  exports: [MailService, IMailRepository],
})
export class MailModule {}
