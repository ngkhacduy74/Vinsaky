import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { UserRepoAbstract } from 'src/modules/user/domain/repositories/user.abstract.repo';
import { PostEntity } from 'src/modules/post/domain/entities/post.entity';
import { PostRepoAbstract } from 'src/modules/post/domain/repositories/post.repositories';
import { PostDocument } from 'src/modules/post/domain/interfaces/post-document.interface';
import { CreatePostDto } from 'src/modules/post/presentation/dtos/req/create-post.dto';
import { GetAllPostQueryDto } from 'src/modules/post/presentation/dtos/req/get-all-post.dto';
import { PostResponseDto } from 'src/modules/post/presentation/dtos/res/post.dto';
import { PaginationResponse } from 'src/common/dto/pagination.dto';
import { PostAbstract } from 'src/modules/post/application/post.abstract';
import { UpdatePostDto } from 'src/modules/post/presentation/dtos/req/update-post.dto';
import { ChangePostConditionDto } from 'src/modules/post/presentation/dtos/req/change-post-condition.dto';
import { CreateCommentDto } from 'src/modules/post/presentation/dtos/req/create-comment.dto';
import { PostDomainService } from 'src/modules/post/domain/services/post-domain.service';
import { PostQueryService } from 'src/modules/post/domain/services/post-query.service';
import { UserDomainPostService } from 'src/modules/user/domain/services/user-domain-post.service';
import { PaginationUtil } from 'src/utils/pagination.util';
import { ResponseBuilderUtil } from 'src/utils/response-builder.util';
import { PostMapper } from 'src/modules/post/infrastructure/mappers/post.mapper';

@Injectable()
export class PostService extends PostAbstract {
  constructor(
    private readonly postRepository: PostRepoAbstract,
    private readonly userRepository: UserRepoAbstract,
    private readonly postDomainService: PostDomainService,
    private readonly postQueryService: PostQueryService,
    private readonly userDomainPostService: UserDomainPostService,
  ) {
    super();
  }

  async createPost(
    data: CreatePostDto,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>> {
    try {
      // 1. Validate user exists
      const user = await this.userRepository.findByUserId(user_id);
      this.postDomainService.validateUserExists(user);

      // 2. Check post limit atomically (prevents race condition)
      const canCreate =
        await this.userDomainPostService.incrementPostCountAtomically(user_id);
      if (!canCreate) {
        throw new ConflictException(
          'Bạn đã dùng hết lượt đăng bài. Vui lòng nâng cấp tài khoản.',
        );
      }

      // 3. Create post
      const sellerForPost = user
        ? {
            id: user.id,
            fullname: user.fullname,
            phone: user.phone,
            email: user.email,
            address: user.address,
            gender: user.gender,
            role: user.role,
            ava_img_url: user.ava_img_url,
            is_active: user.is_active,
            license: user.license,
            isPremium: user.isPremium,
            postCount: user.postCount,
            lastLoginAt: user.lastLoginAt,
            lastActivityAt: user.lastActivityAt,
            is_deleted: user.is_deleted,
            deleted_at: user.deleted_at,
          }
        : undefined;

      const created = await this.postRepository.create({
        ...data,
        seller: sellerForPost,
        status: (data as any).status,
      });

      // 4. Map response
      const dto = PostMapper.toResponseDto(created);

      return ResponseBuilderUtil.success('Tạo bài đăng thành công', dto);
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Dữ liệu bị trùng (duplicate key)');
      }
      if (err?.status) throw err;

      throw new InternalServerErrorException(
        err?.message || 'Tạo bài đăng thất bại',
      );
    }
  }

  async loadMyPost(
    user_id: string,
    data: GetAllPostQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<PostResponseDto>>> {
    try {
      // 1. Build query using domain service
      const searchQuery = this.postQueryService.buildSearchQuery(data, user_id);
      const sortQuery = this.postQueryService.buildSortQuery(
        data.sortBy,
        data.sortOrder,
      );
      const { skip, limit } = PaginationUtil.calculateSkipLimit(
        data.skip,
        data.limit,
      );

      // 2. Execute queries in parallel
      const [total, posts] = await Promise.all([
        this.postRepository.countPosts(searchQuery),
        this.postRepository.findPosts(searchQuery, skip, limit, sortQuery),
      ]);

      // 3. Map responses
      const responseItems = PostMapper.toResponseDtoList(posts);
      const paginationData = PaginationUtil.createPaginationResponse(
        responseItems,
        total,
        skip,
        limit,
      );

      return ResponseBuilderUtil.success(
        'Lấy bài đăng của bạn thành công',
        paginationData,
      );
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Lấy bài đăng thất bại',
      );
    }
  }

  async loadAllPost(
    data: GetAllPostQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<PostResponseDto>>> {
    try {
      // 1. Build query using domain service
      const searchQuery = this.postQueryService.buildSearchQuery(data);
      const sortQuery = this.postQueryService.buildSortQuery(
        data.sortBy,
        data.sortOrder,
      );
      const { skip, limit } = PaginationUtil.calculateSkipLimit(
        data.skip,
        data.limit,
      );

      // 2. Execute queries in parallel
      const [total, posts] = await Promise.all([
        this.postRepository.countPosts(searchQuery),
        this.postRepository.findPosts(searchQuery, skip, limit, sortQuery),
      ]);

      // 3. Map responses
      const responseItems = PostMapper.toResponseDtoList(posts);
      const paginationData = PaginationUtil.createPaginationResponse(
        responseItems,
        total,
        skip,
        limit,
      );

      return ResponseBuilderUtil.success(
        'Lấy danh sách bài đăng thành công',
        paginationData,
      );
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Lấy danh sách bài đăng thất bại',
      );
    }
  }
  async getPostById(
    id: string,
    user_id?: string,
  ): Promise<BaseResponseDto<PostResponseDto>> {
    try {
      const post = await this.postRepository.findById(id);

      if (!post) {
        throw new NotFoundException('Bài đăng không tồn tại');
      }

      const dto = PostMapper.toResponseDto(post);

      return ResponseBuilderUtil.success('Lấy bài đăng thành công', dto);
    } catch (err: any) {
      if (err?.name === 'CastError') {
        throw new NotFoundException('ID bài đăng không hợp lệ');
      }
      throw new InternalServerErrorException(
        err?.message || 'Lấy bài đăng thất bại',
      );
    }
  }
  async updatePost(
    id: string,
    data: UpdatePostDto,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(
        id,
        this.postRepository,
      );

      // 2. Ensure ownership
      this.postDomainService.ensureOwnership(post, user_id);

      // 3. Build update payload
      const updatePayload = this.postDomainService.buildUpdatePayload(data);

      // 4. Update post
      const updated = await this.postRepository.updateById(id, updatePayload);
      if (!updated) throw new NotFoundException('Cập nhật thất bại');

      // 5. Map response
      const dto = PostMapper.toResponseDto(updated);

      return ResponseBuilderUtil.success('Cập nhật bài đăng thành công', dto);
    } catch (err: any) {
      if (err?.status) throw err;

      throw new InternalServerErrorException(
        err?.message || 'Cập nhật bài đăng thất bại',
      );
    }
  }
  async deletePost(
    id: string,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(
        id,
        this.postRepository,
      );

      // 2. Ensure ownership
      this.postDomainService.ensureOwnership(post, user_id);

      // 3. Delete post
      const deleted = await this.postRepository.deleteById(id);
      if (!deleted)
        throw new InternalServerErrorException('Xóa bài đăng thất bại');

      // 4. Map response
      const dto = PostMapper.toResponseDto(deleted);

      return ResponseBuilderUtil.success('Xóa bài đăng thành công', dto);
    } catch (err: any) {
      if (err?.status) throw err;

      throw new InternalServerErrorException(
        err?.message || 'Xóa bài đăng thất bại',
      );
    }
  }
  async changePostCondition(
    id: string,
    data: ChangePostConditionDto,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(
        id,
        this.postRepository,
      );

      // 2. Ensure ownership
      this.postDomainService.ensureOwnership(post, user_id);

      // 3. Update condition
      const updatePayload = { condition: data.condition };
      const updated = await this.postRepository.updateById(id, updatePayload);
      if (!updated)
        throw new InternalServerErrorException('Cập nhật trạng thái thất bại');

      // 4. Map response
      const dto = PostMapper.toResponseDto(updated);

      return ResponseBuilderUtil.success(
        'Thay đổi trạng thái bài đăng thành công',
        dto,
      );
    } catch (err: any) {
      if (err?.status) throw err;

      throw new InternalServerErrorException(
        err?.message || 'Thay đổi trạng thái bài đăng thất bại',
      );
    }
  }
  async addComment(
    id: string,
    user_id: string,
    data: CreateCommentDto,
  ): Promise<BaseResponseDto<PostResponseDto>> {
    if (!user_id) throw new UnauthorizedException('Bạn chưa đăng nhập');

    try {
      const post = await this.postRepository.findById(id);
      if (!post) throw new NotFoundException('Bài đăng không tồn tại');

      const newComment = this.postDomainService.createComment(user_id, data);

      const updated = await this.postRepository.updateById(id, {
        $push: { comments: newComment },
      });

      if (!updated)
        throw new InternalServerErrorException('Thêm bình luận thất bại');

      const dto = PostMapper.toResponseDto(updated);

      return ResponseBuilderUtil.success('Thêm bình luận thành công', dto);
    } catch (err: any) {
      if (err?.name === 'CastError') {
        throw new NotFoundException('ID bài đăng không hợp lệ');
      }

      if (err?.status) throw err;

      throw new InternalServerErrorException(
        err?.message || 'Thêm bình luận thất bại',
      );
    }
  }
  async toggleLike(
    id: string,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(
        id,
        this.postRepository,
      );

      // 2. Toggle like atomically (no race condition)
      const isLiked = post.likes.includes(user_id);
      const updateQuery = this.postDomainService.buildToggleQuery(
        isLiked,
        user_id,
      );

      const updated = await this.postRepository.updateById(id, updateQuery);
      if (!updated) throw new InternalServerErrorException('Thao tác thất bại');

      // 3. Map response
      const dto = PostMapper.toResponseDto(updated);
      const message = this.postDomainService.getLikeMessage(!isLiked); // Toggle state for message

      return ResponseBuilderUtil.success(message, dto);
    } catch (err: any) {
      if (err?.status) throw err;

      throw new InternalServerErrorException(
        err?.message || 'Thao tác thất bại',
      );
    }
  }
  async toggleFavorite(
    id: string,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>> {
    try {
      // 1. Validate and get post
      const post = await this.postDomainService.validatePostId(
        id,
        this.postRepository,
      );

      // 2. Toggle favorite atomically (no race condition)
      const isFavorited = (post.favorites || []).includes(user_id);
      const updateQuery = this.postDomainService.buildFavoriteToggleQuery(
        isFavorited,
        user_id,
      );

      const updated = await this.postRepository.updateById(id, updateQuery);
      if (!updated)
        throw new InternalServerErrorException('Thao tác lưu bài thất bại');

      // 3. Map response
      const dto = PostMapper.toResponseDto(updated);
      const message = this.postDomainService.getFavoriteMessage(!isFavorited); // Toggle state for message

      return ResponseBuilderUtil.success(message, dto);
    } catch (err: any) {
      if (err?.status) throw err;

      throw new InternalServerErrorException(
        err?.message || 'Thao tác lưu bài thất bại',
      );
    }
  }
}
