import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { SortQuery, UserSearchQuery } from 'src/common/interfaces/query.interface';

export abstract class UserRepoAbstract {
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;
  abstract createUser(payload: Partial<UserEntity>): Promise<UserEntity>;
  abstract count(query: UserSearchQuery): Promise<number>;
  abstract findWithPagination(
    query: UserSearchQuery,
    skip: number,
    limit: number,
    sort: SortQuery,
  ): Promise<UserEntity[]>;
  abstract updateByUserId(
    id: string,
    payload: Partial<UserEntity>,
  ): Promise<UserEntity | null>;
  abstract findByUserId(id: string): Promise<UserEntity | null>;
  abstract softDeleteByUserId(id: string): Promise<UserEntity | null>;
  abstract findWithFilters(
    query: UserSearchQuery,
    skip: number,
    limit: number,
    sort: SortQuery,
  ): Promise<UserEntity[]>;
}
