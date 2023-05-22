import { DiscussionResultModel, DiscussionModel } from '@/models/article';
import { defHttp } from '@/utils/http/axios';

enum Api {
    GetArticleCategory = '/category/',
    GetArticleTag = '/tag/',
    GetArticle = '/article/',
    GetDiscussion = '/discussion/',
    GetLike = '/like',
    GetComment = '/comment',
}

export function getArticleCategory(params) {
    return defHttp.get({ url: Api.GetArticleCategory, params });
}
export function getArticleTag(params) {
    return defHttp.get({ url: Api.GetArticleTag, params });
}
export function postArticleCreate(params) {
    return defHttp.post({ url: Api.GetArticle, params });
}
export function putArticle(params, id) {
    return defHttp.put({ url: Api.GetArticle + `${id}/`, params });
}
export function deleteArticle(id) {
    return defHttp.delete({ url: Api.GetArticle + `${id}/` });
}
export function getArticleAll(params) {
    return defHttp.get({ url: Api.GetArticle, params });
}
export function getArticleDetail(id) {
    return defHttp.get({ url: Api.GetArticle + `${id}/` });
}
export function getLike(params) {
    return defHttp.get({ url: Api.GetLike, params });
}
export function postLike(params) {
    return defHttp.post({ url: Api.GetLike, params });
}
export function getComment(params) {
    return defHttp.get({ url: Api.GetComment + '/', params });
}
export function postComment(params) {
    return defHttp.post({ url: Api.GetComment, params });
}
export function deleteComment(id, params) {
    return defHttp.delete({ url: Api.GetComment + `/${id}/`, params });
}
export function postDiscussionCreate(params) {
    return defHttp.post({ url: Api.GetDiscussion, params });
}
export function getDiscussionAll(params) {
    return defHttp.get<DiscussionResultModel>({ url: Api.GetDiscussion, params });
}
export function getDiscussionDetail(id) {
    return defHttp.get<DiscussionModel>({ url: Api.GetDiscussion + `${id}/` });
}
export function deleteDiscussion(id) {
    return defHttp.delete({ url: Api.GetDiscussion + `${id}/` });
}
