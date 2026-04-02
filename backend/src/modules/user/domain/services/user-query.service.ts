import { SortQuery, UserSearchQuery } from 'src/common/interfaces/query.interface';

export class UserQueryService {
  static buildSearchQuery(data: {
    searchTerm?: string;
    statusFilter?: string;
    roleFilter?: string;
  }): UserSearchQuery {
    const query: UserSearchQuery = {
      isDeleted: false,
    };

    if (data.searchTerm) {
      query.search = {
        search: data.searchTerm,
        fields: ['fullname', 'email', 'phone'],
      };
    }

    if (data.statusFilter) {
      query.status = data.statusFilter;
    }

    if (data.roleFilter) {
      query.role = data.roleFilter;
    }

    return query;
  }

  static buildSortQuery(
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
  ): SortQuery {
    return {
      field: sortBy || 'createdAt',
      order: sortOrder || 'desc',
    };
  }
}
