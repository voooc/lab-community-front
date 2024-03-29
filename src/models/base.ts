export interface BasicPageParams {
    page: number;
    pageSize: number;
}

export interface BasicFetchResult<T> {
    items: T[];
    total: number;
    next: null | string;
    previous: null | string;
}
