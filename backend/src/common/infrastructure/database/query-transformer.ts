import {
  ProductSearchQuery,
  UserSearchQuery,
  OrderSearchQuery,
  PostSearchQuery,
  SortQuery,
  SearchFilter,
  TextFilter,
  NumberRange,
} from '../../interfaces/query.interface';

export class MongoQueryTransformer {
  static transformSearchQuery(query: ProductSearchQuery): Record<string, any> {
    const mongoQuery: Record<string, any> = {};

    if (query.search) {
      const { search, fields = ['name'] } = query.search;
      const orConditions = fields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
      mongoQuery.$or = orConditions;
    }

    if (query.category) {
      const { contains, caseSensitive } = query.category;
      mongoQuery.category = {
        $regex: contains,
        $options: caseSensitive ? '' : 'i',
      };
    }

    if (query.brand) {
      const { contains, caseSensitive } = query.brand;
      mongoQuery.brand = {
        $regex: contains,
        $options: caseSensitive ? '' : 'i',
      };
    }

    if (query.status) {
      mongoQuery.status = query.status;
    }

    if (query.price) {
      const { min, max } = query.price;
      mongoQuery.price = {};
      if (min !== undefined) mongoQuery.price.$gte = min;
      if (max !== undefined) mongoQuery.price.$lte = max;
    }

    return mongoQuery;
  }

  static transformUserSearchQuery(query: UserSearchQuery): Record<string, any> {
    const mongoQuery: Record<string, any> = {};

    if (query.search) {
      const { search, fields = ['fullname'] } = query.search;
      const orConditions = fields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
      mongoQuery.$or = orConditions;
    }

    if (query.status) {
      mongoQuery.is_active = query.status === 'active';
    }

    if (query.role) {
      mongoQuery.role = query.role;
    }

    if (query.isDeleted !== undefined) {
      mongoQuery.is_deleted = query.isDeleted ? true : { $ne: true };
    }

    return mongoQuery;
  }

  static transformOrderSearchQuery(
    query: OrderSearchQuery,
  ): Record<string, any> {
    const mongoQuery: Record<string, any> = {};

    if (query.userId) {
      mongoQuery.user_id = query.userId;
    }

    if (query.status) {
      mongoQuery.status = query.status;
    }

    if (query.invoice) {
      mongoQuery['sepay.orderInvoiceNumber'] = {
        $regex: query.invoice,
        $options: 'i',
      };
    }

    if (query.dateRange) {
      mongoQuery.createdAt = {};
      if (query.dateRange.startDate) {
        mongoQuery.createdAt.$gte = query.dateRange.startDate;
      }
      if (query.dateRange.endDate) {
        mongoQuery.createdAt.$lte = query.dateRange.endDate;
      }
    }

    if (query.minTotal !== undefined || query.maxTotal !== undefined) {
      mongoQuery.total = {};
      if (query.minTotal !== undefined) mongoQuery.total.$gte = query.minTotal;
      if (query.maxTotal !== undefined) mongoQuery.total.$lte = query.maxTotal;
    }

    return mongoQuery;
  }

  static transformPostSearchQuery(query: PostSearchQuery): Record<string, any> {
    const mongoQuery: Record<string, any> = {};

    if (query.sellerId) {
      mongoQuery['seller.id'] = query.sellerId;
    }

    if (query.status) {
      mongoQuery.status = query.status;
    }

    if (query.category) {
      mongoQuery.category = query.category;
    }

    if (query.condition) {
      mongoQuery.condition = query.condition;
    }

    if (query.keyword) {
      mongoQuery.$or = [
        { title: { $regex: query.keyword, $options: 'i' } },
        { description: { $regex: query.keyword, $options: 'i' } },
      ];
    }

    return mongoQuery;
  }

  static transformSortQuery(sort: SortQuery): Record<string, 1 | -1> {
    if (!sort.field) return { createdAt: -1 };

    return {
      [sort.field]: sort.order === 'desc' ? -1 : 1,
    };
  }
}

export class SqlQueryTransformer {
  static transformSearchQuery(query: ProductSearchQuery): {
    where: string;
    params: any[];
  } {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (query.search) {
      const { search, fields = ['name'] } = query.search;
      const searchConditions = fields.map(
        (field) => `${field} ILIKE $${paramIndex++}`,
      );
      conditions.push(`(${searchConditions.join(' OR ')})`);
      fields.forEach(() => params.push(`%${search}%`));
    }

    if (query.category) {
      const { contains } = query.category;
      conditions.push(`category ILIKE $${paramIndex++}`);
      params.push(`%${contains}%`);
    }

    if (query.brand) {
      const { contains } = query.brand;
      conditions.push(`brand ILIKE $${paramIndex++}`);
      params.push(`%${contains}%`);
    }

    if (query.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(query.status);
    }

    if (query.price) {
      const { min, max } = query.price;
      if (min !== undefined) {
        conditions.push(`price >= $${paramIndex++}`);
        params.push(min);
      }
      if (max !== undefined) {
        conditions.push(`price <= $${paramIndex++}`);
        params.push(max);
      }
    }

    return {
      where: conditions.length > 0 ? conditions.join(' AND ') : '1=1',
      params,
    };
  }

  static transformSortQuery(sort: SortQuery): string {
    const field = sort.field || 'createdAt';
    const order = sort.order === 'desc' ? 'DESC' : 'ASC';
    return `ORDER BY ${field} ${order}`;
  }
}
