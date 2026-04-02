import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { PaginationResponse } from 'src/common/dto/pagination.dto';
import { GetAllUserQueryDto } from 'src/modules/user/presentation/dto/req/get-all-user-query.dto';
import { UpdateUserDto } from 'src/modules/user/presentation/dto/req/update-user.dto';
import {
  DeleteUserDto,
  PublicUserDto,
  UpdateUserResponseDto,
} from 'src/modules/user/presentation/dto/res/user.dto';

export abstract class UserAbstract {
  abstract getAllUser(
    data: GetAllUserQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<PublicUserDto>>>;
  abstract getUserById(id: string): Promise<BaseResponseDto<PublicUserDto>>;
  abstract updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<BaseResponseDto<UpdateUserResponseDto>>;
  abstract deleteUser(id: string): Promise<BaseResponseDto<DeleteUserDto>>;
  abstract getUserByEmail(
    email: string,
  ): Promise<BaseResponseDto<PublicUserDto>>;
  abstract upgradeInit(userId: string): Promise<BaseResponseDto<any>>;
}
