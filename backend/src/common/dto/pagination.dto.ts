export class PaginationResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  totalPages: number;
}
