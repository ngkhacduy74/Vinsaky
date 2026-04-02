import { ProductStatus } from 'src/modules/product/domain/interfaces/product.interface';
import {
  ProductSearchQuery,
  SortQuery,
} from 'src/common/interfaces/query.interface';

export class ProductQueryService {
  static buildSearchQuery(data: {
    search?: string;
    category?: string;
    brand?: string;
    status?: ProductStatus;
    minPrice?: number;
    maxPrice?: number;
  }): ProductSearchQuery {
    const query: ProductSearchQuery = {};

    if (data.search) {
      query.search = {
        search: data.search,
        fields: ['name', 'brand', 'description'],
      };
    }

    if (data.category) {
      query.category = {
        contains: data.category,
        caseSensitive: false,
      };
    }

    if (data.brand) {
      query.brand = {
        contains: data.brand,
        caseSensitive: false,
      };
    }

    if (data.status) {
      query.status = data.status;
    }

    if (data.minPrice !== undefined || data.maxPrice !== undefined) {
      query.price = {
        min: data.minPrice,
        max: data.maxPrice,
      };
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
