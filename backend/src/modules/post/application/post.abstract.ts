import { BaseResponseDto } from 'src/common/dto/base-response.dto';

import { GetAllPostQueryDto } from 'src/modules/post/presentation/dtos/req/get-all-post.dto';
import { ChangePostConditionDto } from 'src/modules/post/presentation/dtos/req/change-post-condition.dto';
import { CreateCommentDto } from 'src/modules/post/presentation/dtos/req/create-comment.dto';
import { PostResponseDto } from 'src/modules/post/presentation/dtos/res/post.dto';
import { CreatePostDto } from 'src/modules/post/presentation/dtos/req/create-post.dto';
import { UpdatePostDto } from 'src/modules/post/presentation/dtos/req/update-post.dto';
import { PaginationResponse } from 'src/common/dto/pagination.dto';

export abstract class PostAbstract {
  abstract createPost(
    data: CreatePostDto,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>>;

  abstract updatePost(
    id: string,
    data: UpdatePostDto,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>>;

  abstract deletePost(
    id: string,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>>;

  abstract getPostById(
    id: string,
    user_id?: string,
  ): Promise<BaseResponseDto<PostResponseDto>>;

  abstract loadAllPost(
    data: GetAllPostQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<PostResponseDto>>>;

  abstract loadMyPost(
    user_id: string,
    data: GetAllPostQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<PostResponseDto>>>;

  abstract changePostCondition(
    id: string,
    data: ChangePostConditionDto,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>>;

  abstract addComment(
    id: string,
    user_id: string,
    data: CreateCommentDto,
  ): Promise<BaseResponseDto<PostResponseDto>>;

  abstract toggleLike(
    id: string,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>>;

  abstract toggleFavorite(
    id: string,
    user_id: string,
  ): Promise<BaseResponseDto<PostResponseDto>>;
}
