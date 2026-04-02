import { forwardRef, Module } from '@nestjs/common';
import { RabbitMQService } from 'src/configs/rabbitmq.config';

import { EmailConsumer } from 'src/services/rabbitmq/consumers/email.consumer';
import { EmailProducer } from 'src/services/rabbitmq/producers/email.producer';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [forwardRef(() => AuthModule),MailModule],
  providers: [RabbitMQService, EmailConsumer, EmailProducer],
  exports: [RabbitMQService, EmailProducer, EmailConsumer],
})
export class RabbitMQModule {}
