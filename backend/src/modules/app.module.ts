import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth/application/auth.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { LoggerMiddleware } from '../middleware/logging.middleware';
import { TransformInterceptor } from '../interceptors/response.interceptor';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { AuthController } from './auth/presentation/auth.controller';
import { UserModule } from './user/user.module';
import { UploadsModule } from './upload/upload.module';
import { ProductModule } from './product/product.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PostModule } from './post/post.module';
import { MailModule } from './mail/mail.module';
import { BannerModule } from './banner/banner.module';
import { RabbitMQModule } from './rabbitmq.module';
import { BullMQModule } from './bullmq.module';
import { BullModule } from '@nestjs/bullmq';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URL'),
      }),
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullMQModule,

    // ThrottlerModule.forRoot({
    //   throttlers: [
    //     {
    //       ttl: 60_000,
    //       limit: 10,
    //     },
    //   ],
    // }),
    AuthModule,
    UserModule,
    UploadsModule,
    ProductModule,
    DashboardModule,
    PostModule,
    BannerModule,
    OrdersModule,

    // RabbitMQModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
