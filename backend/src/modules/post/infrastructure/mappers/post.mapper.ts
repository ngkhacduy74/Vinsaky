import { PostEntity } from '../../domain/entities/post.entity';
import { PostResponseDto } from '../../presentation/dtos/res/post.dto';
import { Post, PostDocument } from '../database/post.schema';

export class PostMapper {
  static toDomain(document: PostDocument | Post): PostEntity {
    return new PostEntity(
      document.id,
      document.category,
      document.image,
      document.video,
      document.status,
      document.title,
      document.user_position,
      document.address,
      document.description,
      document.seller,
      document.condition,
      document.comments || [],
      document.likes || [],
      document.favorites || [],
      document.content,
      (document as any).createdAt || new Date(),
      (document as any).updatedAt || new Date(),
    );
  }

  static toPersistence(entity: PostEntity): Partial<Post> {
    return {
      id: entity.id,
      category: entity.category,
      image: entity.image,
      video: entity.video,
      status: entity.status,
      title: entity.title,
      user_position: entity.user_position,
      address: entity.address,
      description: entity.description,
      content: entity.content,
      seller: entity.seller,
      condition: entity.condition,
      comments: entity.comments,
      likes: entity.likes,
      favorites: entity.favorites,
    };
  }

  static toResponseDto(entity: PostEntity): PostResponseDto {
    return {
      id: entity.id,
      category: entity.category,
      image: entity.image,
      video: entity.video,
      status: entity.status,
      title: entity.title,
      user_position: entity.user_position,
      address: entity.address,
      description: entity.description,
      content: entity.content,
      seller: entity.seller,
      condition: entity.condition,
      comments: entity.comments,
      likes: entity.likes,
      favorites: entity.favorites,
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
    };
  }

  static toResponseDtoList(entities: PostEntity[]): PostResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
