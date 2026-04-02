import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../database/user.schema';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUser } from '../../domain/interfaces/user.interface';

@Injectable()
export class UserMapper {
  static toDomain(
    document: UserDocument & { createdAt?: Date; updatedAt?: Date },
  ): UserEntity {
    return new UserEntity(
      document.id,
      document.fullname,
      document.phone,
      document.email,
      document.password,
      document.gender,
      document.role,
      document.address,
      document.ava_img_url,
      document.is_active,
      document.license,
      document.isPremium,
      document.postCount,
      document.lastLoginAt,
      document.lastActivityAt,
      document.is_deleted,
      document.deleted_at || undefined,
      document.createdAt,
      document.updatedAt,
    );
  }

  static toPersistence(entity: Partial<UserEntity>): Partial<User> {
    return {
      id: entity.id,
      fullname: entity.fullname,
      phone: entity.phone,
      email: entity.email,
      address: entity.address,
      password: entity.password,
      gender: entity.gender,
      role: entity.role,
      ava_img_url: entity.ava_img_url,
      is_active: entity.is_active,
      license: entity.license,
      isPremium: entity.isPremium,
      postCount: entity.postCount,
      lastLoginAt: entity.lastLoginAt,
      lastActivityAt: entity.lastActivityAt,
      is_deleted: entity.is_deleted,
      deleted_at: entity.deleted_at || undefined,
    };
  }

  static toDomainArray(
    documents: (UserDocument & { createdAt?: Date; updatedAt?: Date })[],
  ): UserEntity[] {
    return documents.map((doc) => UserMapper.toDomain(doc));
  }

  // Convert interface to domain entity (for testing/mock)
  static fromInterface(user: IUser): UserEntity {
    return new UserEntity(
      user.id,
      user.fullname,
      user.phone,
      user.email,
      user.password,
      user.gender,
      user.role,
      user.address,
      user.ava_img_url,
      user.is_active,
      user.license,
      user.isPremium,
      user.postCount,
      user.lastLoginAt,
      user.lastActivityAt,
      user.is_deleted,
      user.deleted_at,
      user.createdAt,
      user.updatedAt,
    );
  }
}
