import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/application/auth.service';
import { AuthAbstract } from 'src/modules/auth/application/auth.abstract';
import { AuthController } from 'src/modules/auth/presentation/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from 'src/services/token.service';

import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullMQService } from 'src/services/bullmq.service';
import { BullMQModule } from '../bullmq.module';
import { RabbitMQModule } from '../rabbitmq.module';
import { MailService } from './application/mail.service';
import { MailDomainService } from './domain/services/mail-domain.service';
import { EmailService } from './infrastructure/services/email.service';
import { MailRepositoryAbstract } from './domain/repositories/mail.repository';

@Module({
  imports: [
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '30m' },
      }),
      inject: [ConfigService],
    }),
    BullMQModule,
    forwardRef(() => UserModule),
    RabbitMQModule,
  ],
  controllers: [AuthController],
  providers: [
    TokenService,
    AuthService,
    MailService,
    MailDomainService,
    EmailService,
    {
      provide: MailRepositoryAbstract,
      useClass: EmailService,
    },
    {
      provide: AuthAbstract,
      useExisting: AuthService,
    },
  ],
  exports: [AuthAbstract, JwtModule, MailService],
})
export class AuthModule {}
