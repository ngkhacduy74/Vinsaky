import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { AuthMapper } from 'src/modules/user/infrastructure/mappers/auth.mapper';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(user: UserEntity): { accessToken: string; refreshToken: string } {
    const payload = AuthMapper.toJwtPayload(user);

    const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        secret: process.env.REFRESH_TOKEN,
        expiresIn: '30d',
      },
    );

    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: process.env.REFRESH_TOKEN,
    });
  }

  generateAccessToken(user: UserEntity): string {
    const payload = AuthMapper.toJwtPayload(user);
    return this.jwtService.sign(payload, { expiresIn: '30m' });
  }
}
