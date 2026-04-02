import {
  OrderSearchQuery,
  SortQuery,
} from 'src/common/interfaces/query.interface';

export class OrderQueryService {
  static buildSearchQuery(data: {
    userId?: string;
    status?: string;
    invoice?: string;
    startDate?: Date;
    endDate?: Date;
    minTotal?: number;
    maxTotal?: number;
  }): OrderSearchQuery {
    const query: OrderSearchQuery = {};

    if (data.userId) {
      query.userId = data.userId;
    }

    if (data.status) {
      query.status = data.status;
    }

    if (data.invoice) {
      query.invoice = data.invoice;
    }

    if (data.startDate || data.endDate) {
      query.dateRange = {
        startDate: data.startDate,
        endDate: data.endDate,
      };
    }

    if (data.minTotal !== undefined || data.maxTotal !== undefined) {
      query.minTotal = data.minTotal;
      query.maxTotal = data.maxTotal;
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
