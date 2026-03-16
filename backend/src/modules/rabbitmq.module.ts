import { Module } from '@nestjs/common';
import { RabbitMQService } from 'src/configs/rabbitmq.config';
import { EmailConsumer } from 'src/services/consumers/email.consumer';
import { EmailProducer } from 'src/services/producers/email.producer';
import { MailModule } from './mail.module';

@Module({
  imports: [MailModule],
  providers: [RabbitMQService, EmailConsumer, EmailProducer],
  exports: [RabbitMQService, EmailProducer, EmailConsumer],
})
export class RabbitMQModule {}
