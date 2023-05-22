import { BannerResultModel, NewsResultModel } from '@/models/news';
import { defHttp } from '@/utils/http/axios';

enum Api {
    GetNew = '/news/',
    GetBanner = '/banner/',
    GetAnnouncement = '/announcement/',
    GetAwards = '/awards/',
}
export function GetNews(params) {
    return defHttp.get<NewsResultModel>({ url: Api.GetNew, params });
}
export function GetSingleNews(id) {
    return defHttp.get({ url: Api.GetNew + id + '/' });
}
export function GetBanner(params) {
    return defHttp.get<BannerResultModel>({ url: Api.GetBanner, params });
}
export function GetSingleAnnouncement(id) {
    return defHttp.get({ url: Api.GetAnnouncement + id + '/' });
}
export function GetAnnouncement(params) {
    return defHttp.get<NewsResultModel>({ url: Api.GetAnnouncement, params });
}
export function GetAwards(params) {
    return defHttp.get({ url: Api.GetAwards, params });
}
