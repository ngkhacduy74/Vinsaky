import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from 'src/modules/post/presentation/dtos/req/create-post.dto';
import { UpdatePostDto } from 'src/modules/post/presentation/dtos/req/update-post.dto';
import { ChangePostConditionDto } from 'src/modules/post/presentation/dtos/req/change-post-condition.dto';
import { CreateCommentDto } from 'src/modules/post/presentation/dtos/req/create-comment.dto';
import { PostEntity } from 'src/modules/post/domain/entities/post.entity';
import { IComment } from 'src/modules/post/domain/interfaces/post.interface';
import { PostRepoAbstract } from '../repositories/post.repositories';

@Injectable()
export class PostDomainService {
  checkPostLimit(user: any): void {
    if (!user) {
      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }

    if (user.role !== 'Admin' && !user.isPremium && user.postCount >= 3) {
      throw new ConflictException(
        'Bạn đã dùng hết lượt đăng bài. Vui lòng nâng cấp tài khoản.',
      );
    }
  }

  validateUserExists(user: any): void {
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
  }

  ensureOwnership(post: PostEntity, userId: string): void {
    if (!post) {
      throw new NotFoundException('Bài đăng không tồn tại');
    }

    const ownerId = post?.seller?.id;
    if (!ownerId || ownerId !== userId) {
      throw new UnauthorizedException('Bạn không có quyền thực hiện thao tác này');
    }
  }

  shouldIncrementPostCount(user: any): boolean {
    return user.role !== 'Admin' && !user.isPremium;
  }

  buildUpdatePayload(data: UpdatePostDto): Record<string, any> {
    const updatePayload: Record<string, any> = { ...data };
    
    // Remove fields that shouldn't be updated directly
    delete updatePayload.seller;
    delete updatePayload.likes;
    delete updatePayload.favorites;
    delete updatePayload.comments;
    delete updatePayload.createdAt;
    delete updatePayload.updatedAt;
    delete updatePayload.id;
    
    return updatePayload;
  }

  createComment(userId: string, data: CreateCommentDto): IComment {
    // Validate comment content
    if (!data.content || data.content.trim().length === 0) {
      throw new BadRequestException('Nội dung bình luận không được để trống');
    }

    if (data.content.length > 1000) {
      throw new BadRequestException('Bình luận không được vượt quá 1000 ký tự');
    }

    // Sanitize content (basic sanitization - you might want to use a proper sanitization library)
    const sanitizedContent = data.content.trim();

    return {
      user_id: userId,
      content: sanitizedContent,
      createdAt: new Date(),
    };
  }

  buildToggleQuery(isCurrentlyToggled: boolean, userId: string): Record<string, any> {
    return isCurrentlyToggled
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };
  }

  buildFavoriteToggleQuery(isCurrentlyFavorited: boolean, userId: string): Record<string, any> {
    return isCurrentlyFavorited
      ? { $pull: { favorites: userId } }
      : { $addToSet: { favorites: userId } };
  }

  getLikeMessage(isLiked: boolean): string {
    return isLiked ? 'Bỏ thích bài đăng thành công' : 'Thích bài đăng thành công';
  }

  getFavoriteMessage(isFavorited: boolean): string {
    return isFavorited ? 'Đã bỏ lưu bài đăng' : 'Lưu bài đăng thành công';
  }

  async validatePostId(id: string, postRepository: PostRepoAbstract): Promise<PostEntity> {
    if (!id) {
      throw new BadRequestException('Id không được để trống');
    }
    const post = await postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Bài đăng không tồn tại');
    }
    return post;
  }
}
