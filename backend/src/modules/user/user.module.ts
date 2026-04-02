import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UserAbstract } from 'src/modules/user/application/user.abstract';
import { UserController } from 'src/modules/user/presentation/user.controller';
import { UserRepository } from 'src/modules/user/infrastructure/repositories/user.repositories';
import { User, UserSchema } from 'src/modules/user/infrastructure/database/user.schema';
import { UserService } from 'src/modules/user/application/user.service';
import { UrlService } from 'src/services/url.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepoAbstract } from 'src/modules/user/domain/repositories/user.abstract.repo';
import { UserDomainPostService } from 'src/modules/user/domain/services/user-domain-post.service';
import { VipService } from 'src/modules/user/domain/services/vip.service';
import { AuthModule } from '../auth/auth.module';
import { InvoiceService } from '../order/domain/services/invoice.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UrlService,
    UserService,
    UserDomainPostService,
    VipService,
    InvoiceService,
    {
      provide: UserRepoAbstract,
      useClass: UserRepository,
    },
    {
      provide: UserAbstract,
      useClass: UserService,
    },
  ],
  exports: [
    UserAbstract,
    UserRepository,
    UserRepoAbstract,
    UserDomainPostService,
    VipService,
    JwtModule,
  ],
})
export class UserModule {}
