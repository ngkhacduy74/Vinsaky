import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { LoginDto, LoginResponse } from 'src/modules/auth/presentation/dtos/req/auth/login.dto';
import {
  RegisterDto,
  RegisterResponse,
} from 'src/modules/auth/presentation/dtos/req/auth/register.dto';
import { RefreshTokenDto } from 'src/modules/auth/presentation/dtos/req/auth/refresh-token.dto';

export abstract class AuthAbstract {
  abstract login(data: LoginDto): Promise<BaseResponseDto<LoginResponse>>;
  abstract register(
    data: RegisterDto,
  ): Promise<BaseResponseDto<RegisterResponse>>;
  abstract refreshToken(
    data: RefreshTokenDto,
  ): Promise<BaseResponseDto<LoginResponse>>;
}
