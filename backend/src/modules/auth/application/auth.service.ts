import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/presentation/dtos/req/auth/login.dto';
import {
  LoginResponse,
  PublicUser,
} from 'src/modules/auth/presentation/dtos/req/auth/login.dto';
import { AuthAbstract } from 'src/modules/auth/application/auth.abstract';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { UserDomainService } from 'src/modules/user/domain/services/user-domain.service';
import { TokenService } from 'src/services/token.service';
import { RefreshTokenDto } from 'src/modules/auth/presentation/dtos/req/auth/refresh-token.dto';
import {
  RegisterDto,
  RegisterResponse,
} from 'src/modules/auth/presentation/dtos/req/auth/register.dto';
import { EmailProducer } from '../../../services/rabbitmq/producers/email.producer';
import { welcomeRegisterEmail } from 'src/common/shared/function/register-email-template';
import { BullMQService } from '../../../services/bullmq.service';
import { MailType } from 'src/modules/mail/domain/entities/mail.entity';
import { UserRepoAbstract } from 'src/modules/user/domain/repositories/user.abstract.repo';
import { AuthMapper } from 'src/modules/user/infrastructure/mappers/auth.mapper';

@Injectable()
export class AuthService extends AuthAbstract {
  constructor(
    private readonly userRepository: UserRepoAbstract,
    private readonly tokenService: TokenService,
    private readonly emailProducer: EmailProducer,
    private readonly bullMQ: BullMQService,
  ) {
    super();
  }

  async login(data: LoginDto): Promise<BaseResponseDto<LoginResponse>> {
    const user = await this.userRepository.findUserByEmail(data.email);

    if (!user || !user.canLogin()) {
      throw new UnauthorizedException(
        'Tài khoản không tồn tại hoặc đã bị khóa',
      );
    }

    const isMatch = await UserDomainService.validatePassword(
      data.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);
    const publicUser = AuthMapper.toPublicUser(user);

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: publicUser,
      },
    };
  }
  async register(
    data: RegisterDto,
  ): Promise<BaseResponseDto<RegisterResponse>> {
    const exist = await this.userRepository.findUserByEmail(data.email);
    if (exist) {
      throw new ConflictException({
        message: 'Email đã được đăng ký',
        errors: { email: 'EMAIL_EXISTS' },
      });
    }

    try {
      const newUser = await UserDomainService.createNewUser({
        fullname: data.fullname,
        phone: data.phone,
        email: data.email,
        password: data.password,
        gender: data.gender,
        address: data.address,
        ava_img_url: data.ava_img_url,
      });

      const created = await this.userRepository.createUser(newUser);
      const publicUser = AuthMapper.toPublicUser(created);

      // Convert UserEntity to User schema for email template
      const userForEmail = {
        fullname: created.fullname,
        email: created.email,
        createdAt: created.createdAt,
      };
      const email = welcomeRegisterEmail(userForEmail as any);

      //rabbitmq
      await this.emailProducer.sendEmailJob({
        to: created.email,
        subject: 'Chào mừng bạn đến với Vinsaky',
        content: email,
        type: MailType.WELCOME,
      });

      //bullmq
      try {
        await this.bullMQ.sendWelcomeEmail({
          receiver: created.email,
          subject: 'Chào mừng bạn đến với Vinsaky',
          content: email,
          type: MailType.WELCOME,
        });
      } catch (err) {
        console.error('Queue error:', err);
      }

      return {
        success: true,
        data: {
          user: publicUser,
        },
      };
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException({
          message: 'Email đã được đăng ký',
          errors: { email: 'EMAIL_EXISTS' },
        });
      }
      throw new InternalServerErrorException({
        message: 'Đăng ký thất bại',
        errors: err?.message,
      });
    }
  }

  async refreshToken(
    data: RefreshTokenDto,
  ): Promise<BaseResponseDto<LoginResponse>> {
    try {
      const payload = this.tokenService.verifyRefreshToken(data.refreshToken);

      if (payload?.type !== 'refresh' || !payload?.email) {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      const user = await this.userRepository.findUserByEmail(payload.email);

      if (!user || !user.canLogin()) {
        throw new UnauthorizedException(
          'Tài khoản không tồn tại hoặc đã bị khóa',
        );
      }

      const accessToken = this.tokenService.generateAccessToken(user);
      const newRefreshToken =
        this.tokenService.generateTokens(user).refreshToken;
      const publicUser = AuthMapper.toPublicUser(user);

      return {
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
          user: publicUser,
        },
      };
    } catch (e: any) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException(
        'Refresh token đã hết hạn hoặc không hợp lệ',
      );
    }
  }
}
