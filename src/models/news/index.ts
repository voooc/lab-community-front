export interface NewsResultModel {
    total: number;
    next: null | string;
    previous: null | string;
    items: Array<NewsItem>;
}
export interface NewsItem {
    id?: string;
    title: string;
    desc?: string;
    image?: string;
    content: string;
    add_time: string;
    is_publish?: Boolean;
    previous?: {
        id: string;
        title: string;
    };
    next?: {
        id: string;
        title: string;
    };
}
export interface BannerResultModel {
    total: number;
    next: null | string;
    previous: null | string;
    items: Array<BannerItem>;
}
export interface BannerItem {
    id?: string;
    title: string;
    image?: string;
    add_time: string;
}
