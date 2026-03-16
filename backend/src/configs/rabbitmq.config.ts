import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection!: amqp.ChannelModel;
  private channel!: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  async connect(): Promise<amqp.Channel> {
    const url = process.env.RMQ_URL || 'amqp://user:password@rabbitmq:5672';

    while (true) {
      try {
        console.log('Connecting to RabbitMQ...');

        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();

        console.log('RabbitMQ connected');

        return this.channel;
      } catch (error) {
        console.log('RabbitMQ not ready, retrying in 5s...');
        await new Promise((res) => setTimeout(res, 5000));
      }
    }
  }

  getChannel(): amqp.Channel {
    return this.channel;
  }
}
