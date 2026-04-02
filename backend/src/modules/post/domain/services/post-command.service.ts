import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { UserRepoAbstract } from 'src/modules/user/domain/repositories/user.abstract.repo';
import { PostEntity } from 'src/modules/post/domain/entities/post.entity';
import { PostRepoAbstract } from 'src/modules/post/domain/repositories/post.repositories';
import { CreatePostInput } from 'src/modules/post/application/inputs/create-post.input';
import { UpdatePostInput } from 'src/modules/post/application/inputs/update-post.input';
import { ChangePostConditionInput } from 'src/modules/post/application/inputs/change-post-condition.input';
import { ResponseBuilderUtil } from 'src/utils/response-builder.util';
import { PostMapper } from 'src/modules/post/infrastructure/mappers/post.mapper';
import { PostDomainService } from 'src/modules/post/domain/services/post-domain.service';
import { UserDomainPostService } from 'src/modules/user/domain/services/user-domain-post.service';
import { PostCondition } from 'src/modules/post/domain/interfaces/post.interface';

@Injectable()
export class PostCommandService {
  constructor(
    private readonly postRepository: PostRepoAbstract,
    private readonly userRepository: UserRepoAbstract,
    private readonly postDomainService: PostDomainService,
    private readonly userDomainPostService: UserDomainPostService,
  ) {}

  async createPost(
    data: CreatePostInput,
    user: any,
  ): Promise<BaseResponseDto<any>> {
    try {
      // 1. Validate user and check post limit
      this.postDomainService.validateUserExists(user);
      this.postDomainService.checkPostLimit(user);

      // 2. Create seller object for post
      const sellerForPost = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      };

      // 3. Map input to post entity
      const postEntity: Partial<PostEntity> = {
        category: data.category,
        title: data.title,
        description: data.description,
        seller: sellerForPost,
        condition: data.condition as PostCondition,
        image: data.images,
        video: data.videos,
        address: data.address,
        content: data.content,
        status: (data as any).status,
      };

      // 4. Create post
      const createdPost = await this.postRepository.create(postEntity);

      // 5. Increment user post count
      await this.userDomainPostService.incrementPostCountAtomically(user.id);

      // 6. Map to response DTO
      const responseDto = PostMapper.toResponseDto(createdPost);

      return ResponseBuilderUtil.success(
        'Tạo bài đăng thành công',
        responseDto,
      );
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi khi tạo bài đăng: ' + error.message,
      );
    }
  }

  async updatePost(
    id: string,
    data: UpdatePostInput,
    user_id: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(id, this.postRepository);
      
      // 2. Ensure ownership
      this.postDomainService.ensureOwnership(post, user_id);

      // 3. Update post
      const updateData = {
        title: data.title,
        description: data.description,
        condition: data.condition as PostCondition,
        image: data.images,
        video: data.videos,
        address: data.address,
        content: data.content,
      };

      const updatedPost = await this.postRepository.updateById(id, updateData);

      if (!updatedPost) {
        throw new NotFoundException('Không thể cập nhật bài đăng');
      }

      const responseDto = PostMapper.toResponseDto(updatedPost);

      return ResponseBuilderUtil.success(
        'Cập nhật bài đăng thành công',
        responseDto,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi khi cập nhật bài đăng: ' + error.message,
      );
    }
  }

  async changePostCondition(
    id: string,
    data: ChangePostConditionInput,
    user_id: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(id, this.postRepository);
      
      // 2. Ensure ownership
      this.postDomainService.ensureOwnership(post, user_id);

      // 3. Update post condition
      const updatedPost = await this.postRepository.updateById(id, {
        condition: data.condition as PostCondition,
      });

      if (!updatedPost) {
        throw new NotFoundException('Không thể cập nhật tình trạng bài đăng');
      }

      const responseDto = PostMapper.toResponseDto(updatedPost);

      return ResponseBuilderUtil.success(
        'Cập nhật tình trạng bài đăng thành công',
        responseDto,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi khi cập nhật tình trạng bài đăng: ' + error.message,
      );
    }
  }

  async deletePost(
    id: string,
    user_id: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(id, this.postRepository);
      
      // 2. Ensure ownership
      this.postDomainService.ensureOwnership(post, user_id);

      // 3. Delete post
      const deletedPost = await this.postRepository.deleteById(id);

      if (!deletedPost) {
        throw new NotFoundException('Không thể xóa bài đăng');
      }

      const responseDto = PostMapper.toResponseDto(deletedPost);

      return ResponseBuilderUtil.success(
        'Xóa bài đăng thành công',
        responseDto,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi khi xóa bài đăng: ' + error.message,
      );
    }
  }
}
