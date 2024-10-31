export type mdlBasePaginatedResponse<T> = {
    data?: Array<T>;
    pageNumber?: number;
    totalPages?: number;
    totalCount?: number;
    resultCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
}