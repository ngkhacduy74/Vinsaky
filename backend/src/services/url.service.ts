import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateUpgradeUrl(userId: string): string {
    const token = this.jwtService.sign(
      { userId, type: 'upgrade' },
      { expiresIn: '1h' }
    );
    return `${this.config.get('FRONTEND_URL')}/upgrade?token=${token}`;
  }

  generatePasswordResetUrl(userId: string): string {
    const token = this.jwtService.sign(
      { userId, type: 'password-reset' },
      { expiresIn: '30m' }
    );
    return `${this.config.get('FRONTEND_URL')}/reset-password?token=${token}`;
  }

  generateEmailVerificationUrl(userId: string): string {
    const token = this.jwtService.sign(
      { userId, type: 'email-verification' },
      { expiresIn: '24h' }
    );
    return `${this.config.get('FRONTEND_URL')}/verify-email?token=${token}`;
  }
}
