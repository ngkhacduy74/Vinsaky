import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { PostEntity } from 'src/modules/post/domain/entities/post.entity';
import { PostRepoAbstract } from 'src/modules/post/domain/repositories/post.repositories';
import { CreateCommentInput } from 'src/modules/post/application/inputs/create-comment.input';
import { ResponseBuilderUtil } from 'src/utils/response-builder.util';
import { PostMapper } from 'src/modules/post/infrastructure/mappers/post.mapper';
import { PostDomainService } from 'src/modules/post/domain/services/post-domain.service';

@Injectable()
export class PostInteractionService {
  constructor(
    private readonly postRepository: PostRepoAbstract,
    private readonly postDomainService: PostDomainService,
  ) {}

  async getPostById(
    id: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      const post = await this.postRepository.findById(id);

      if (!post) {
        throw new NotFoundException('Bài đăng không tồn tại');
      }

      const responseDto = PostMapper.toResponseDto(post);

      return ResponseBuilderUtil.success(
        'Lấy thông tin bài đăng thành công',
        responseDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi khi lấy thông tin bài đăng: ' + error.message,
      );
    }
  }

  async addComment(
    id: string,
    data: CreateCommentInput,
    user_id: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(id, this.postRepository);

      // 2. Create comment object
      const comment = {
        id: crypto.randomUUID(),
        user_id: user_id,
        content: data.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 3. Add comment to post
      const updatedPost = await this.postRepository.addComment(id, comment);

      if (!updatedPost) {
        throw new NotFoundException('Không thể thêm bình luận');
      }

      const responseDto = PostMapper.toResponseDto(updatedPost);

      return ResponseBuilderUtil.success(
        'Thêm bình luận thành công',
        responseDto,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi khi thêm bình luận: ' + error.message,
      );
    }
  }

  async toggleLike(
    id: string,
    user_id: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(id, this.postRepository);

      // 2. Toggle like atomically (no race condition)
      const isLiked = post.likes.includes(user_id);
      const updateQuery = this.postDomainService.buildToggleQuery(isLiked, user_id);
      
      const updatedPost = await this.postRepository.updateById(id, updateQuery);

      if (!updatedPost) {
        throw new NotFoundException('Không thể cập nhật lượt thích');
      }

      const responseDto = PostMapper.toResponseDto(updatedPost);
      const message = this.postDomainService.getLikeMessage(isLiked);

      return ResponseBuilderUtil.success(
        message,
        responseDto,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi khi cập nhật lượt thích: ' + error.message,
      );
    }
  }

  async toggleFavorite(
    id: string,
    user_id: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(id, this.postRepository);

      // 2. Toggle favorite atomically (no race condition)
      const isFavorited = (post.favorites || []).includes(user_id);
      const updateQuery = this.postDomainService.buildFavoriteToggleQuery(isFavorited, user_id);
      
      const updatedPost = await this.postRepository.updateById(id, updateQuery);

      if (!updatedPost) {
        throw new NotFoundException('Không thể cập nhật lượt lưu');
      }

      const responseDto = PostMapper.toResponseDto(updatedPost);
      const message = this.postDomainService.getFavoriteMessage(isFavorited);

      return ResponseBuilderUtil.success(
        message,
        responseDto,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi khi cập nhật lượt lưu: ' + error.message,
      );
    }
  }
}
