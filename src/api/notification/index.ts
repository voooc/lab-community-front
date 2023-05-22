import { defHttp } from '@/utils/http/axios';

enum Api {
    GetUserSystemMessage = '/user/message/',
    GetUserUnreadMessage = '/user/message/count/',
}

export function getUserSystemMessage(params) {
    return defHttp.get({ url: Api.GetUserSystemMessage, params: params });
}
export function putUserSystemMessage(params, id) {
    return defHttp.put({ url: Api.GetUserSystemMessage + `${id}/`, params: params });
}
export function delectUserSystemMessage(id) {
    return defHttp.delete({ url: Api.GetUserSystemMessage + `${id}/` });
}
export function delectAllUserSystemMessage(params) {
    return defHttp.post({ url: Api.GetUserSystemMessage + 'read_all/', params });
}
export function getUserUnreadMessage() {
    return defHttp.get({ url: Api.GetUserUnreadMessage });
}
