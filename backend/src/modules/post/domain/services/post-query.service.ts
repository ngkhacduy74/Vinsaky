import { Injectable } from '@nestjs/common';
import {
  PostSearchQuery,
  SortQuery,
} from 'src/common/interfaces/query.interface';
import { GetAllPostQueryDto } from 'src/modules/post/presentation/dtos/req/get-all-post.dto';

@Injectable()
export class PostQueryService {
  buildSearchQuery(
    data: GetAllPostQueryDto,
    sellerId?: string,
  ): PostSearchQuery {
    const query: PostSearchQuery = {};

    if (sellerId) {
      query.sellerId = sellerId;
    }

    if (data.status) {
      query.status = data.status;
    }

    if (data.category) {
      query.category = data.category;
    }

    if (data.condition) {
      query.condition = data.condition;
    }

    if (data.q?.trim()) {
      query.keyword = data.q.trim();
    }

    return query;
  }

  buildSortQuery(sortBy?: string, sortOrder?: 'asc' | 'desc'): SortQuery {
    return {
      field: sortBy || 'createdAt',
      order: sortOrder || 'desc',
    };
  }
}
