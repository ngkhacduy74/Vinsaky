import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { PublicUser } from 'src/modules/auth/presentation/dtos/req/auth/login.dto';

export class AuthMapper {
  static toPublicUser(user: UserEntity): PublicUser {
    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      ava_img_url: user.ava_img_url,
      phone: user.phone,
      address: user.address,
      isPremium: user.isPremium,
      postCount: user.postCount,
    };
  }

  static toJwtPayload(user: UserEntity) {
    return {
      id: user.id,
      role: user.role,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      ava_img_url: user.ava_img_url,
    };
  }
}
