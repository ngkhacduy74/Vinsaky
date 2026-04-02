import { PostEntity } from 'src/modules/post/domain/entities/post.entity';
import { IPost } from 'src/modules/post/domain/interfaces/post.interface';
import {
  PostSearchQuery,
  SortQuery,
} from 'src/common/interfaces/query.interface';

export abstract class PostRepoAbstract {
  abstract create(doc: Partial<IPost>): Promise<PostEntity>;
  abstract findOne(filter: Partial<IPost>): Promise<PostEntity | null>;
  abstract findById(id: string): Promise<PostEntity | null>;
  abstract findByIdWithSeller(id: string): Promise<PostEntity | null>;
  abstract count(filter: Record<string, any>): Promise<number>;
  abstract countPosts(query: PostSearchQuery): Promise<number>;
  abstract findPosts(
    query: PostSearchQuery,
    skip: number,
    limit: number,
    sort: SortQuery,
  ): Promise<PostEntity[]>;
  abstract findMany(
    filter: Record<string, any>,
    options?: any,
  ): Promise<PostEntity[]>;
  abstract updateById(
    id: string,
    update: Partial<IPost> | Record<string, any>,
  ): Promise<PostEntity | null>;
  abstract deleteById(id: string): Promise<PostEntity | null>;

  // Interaction methods
  abstract addComment(id: string, comment: any): Promise<PostEntity | null>;
  abstract toggleLike(id: string, userId: string): Promise<PostEntity | null>;
  abstract toggleFavorite(
    id: string,
    userId: string,
  ): Promise<PostEntity | null>;
}
