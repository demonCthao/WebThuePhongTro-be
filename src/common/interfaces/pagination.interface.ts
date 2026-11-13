export interface PaginatedResult<T> {
  list: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}
