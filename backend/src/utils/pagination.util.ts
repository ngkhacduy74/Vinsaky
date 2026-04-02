import { PaginationResponse } from 'src/common/dto/pagination.dto';

export class PaginationUtil {
  static createPaginationResponse<T>(
    items: T[],
    total: number,
    skip: number,
    limit: number,
  ): PaginationResponse<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      items,
      total,
      skip,
      limit,
      totalPages,
    };
  }

  static calculateSkipLimit(skip?: number, limit?: number): { skip: number; limit: number } {
    return {
      skip: Math.max(0, skip || 0),
      limit: Math.min(100, Math.max(1, limit || 10)), // Cap at 100 for performance
    };
  }
}
