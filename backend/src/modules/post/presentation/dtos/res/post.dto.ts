// src/dtos/response/post.dto.ts
import { Expose, Type } from 'class-transformer';
import { PublicUserDto } from 'src/modules/user/presentation/dto/res/user.dto';
import {
  Comment,
  PostCondition,
  PostStatus,
  UserPosition,
} from 'src/modules/post/infrastructure/database/post.schema';

export class CommentResponseDto {
  @Expose()
  user_id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;
}

export class PostResponseDto {
  @Expose()
  id: string;

  @Expose()
  category: string;

  @Expose()
  image: string[];

  @Expose()
  video: string[];

  @Expose()
  status: PostStatus;

  @Expose()
  title: string;

  @Expose()
  user_position: UserPosition;

  @Expose()
  address: string;

  @Expose()
  description: string;

  @Expose()
  content?: string;

  @Expose()
  seller: PublicUserDto;

  @Expose()
  condition: PostCondition;

  @Expose()
  @Type(() => CommentResponseDto)
  comments: CommentResponseDto[];

  @Expose()
  likes: string[];

  @Expose()
  favorites: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
