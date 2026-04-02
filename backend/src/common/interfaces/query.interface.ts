export interface SearchFilter {
  search?: string;
  fields?: string[];
}

export interface TextFilter {
  contains?: string;
  caseSensitive?: boolean;
}

export interface NumberRange {
  min?: number;
  max?: number;
}

export interface ProductSearchQuery {
  search?: SearchFilter;
  category?: TextFilter;
  brand?: TextFilter;
  status?: string;
  price?: NumberRange;
}

export interface UserSearchQuery {
  search?: SearchFilter;
  status?: string;
  role?: string;
  isDeleted?: boolean;
}

export interface OrderSearchQuery {
  userId?: string;
  status?: string;
  invoice?: string;
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  minTotal?: number;
  maxTotal?: number;
}

export interface PostSearchQuery {
  sellerId?: string;
  status?: string;
  category?: string;
  condition?: string;
  keyword?: string;
}

export interface SortQuery {
  field?: string;
  order?: 'asc' | 'desc';
}
