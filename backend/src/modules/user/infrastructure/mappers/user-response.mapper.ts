import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { PublicUserDto, UpdateUserResponseDto } from 'src/modules/user/presentation/dto/res/user.dto';

export class UserResponseMapper {
  static toPublicDto(user: UserEntity): PublicUserDto {
    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      ava_img_url: user.ava_img_url,
      phone: user.phone,
      is_active: user.is_active,
      isPremium: user.isPremium,
      postCount: user.postCount,
    };
  }

  static toUpdateResponseDto(user: UserEntity): UpdateUserResponseDto {
    return {
      fullname: user.fullname,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      ava_img_url: user.ava_img_url,
    };
  }
}
