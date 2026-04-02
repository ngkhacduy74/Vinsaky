import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from 'src/modules/post/presentation/dtos/res/post.dto';

export class PostMapper {
  static toResponseDto(post: any): PostResponseDto {
    return plainToInstance(PostResponseDto, post.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  static toResponseDtoList(posts: any[]): PostResponseDto[] {
    return plainToInstance(
      PostResponseDto,
      posts.map((p) => p.toObject()),
      { excludeExtraneousValues: true },
    );
  }
}
