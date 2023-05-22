import { defHttp } from '@/utils/http/axios';
import {
    LoginParams,
    LoginResultModel,
    GetUserInfoModel,
    FollowResultModel,
} from './model/userModel';
import { UserInfo } from '@/models/user/user';
import { ErrorMessageMode } from '/#/axios';
enum Api {
    Login = '/user/login',
    Logout = '/user/logout',
    Register = '/user/register',
    RegisterSms = '/user/register_email',
    RetrieveSms = '/user/retrieve_email',
    Retrieve = '/user/retrieve',
    GetUserInfo = '/user/info',
    GetSystemDepartment = '/user/departments/',
    GetUser = '/user/user/',
    GetFollow = '/user/follow/',
    GetLike = '/user/like/',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'none') {
    return defHttp.post<LoginResultModel>(
        {
            url: Api.Login,
            params,
        },
        {
            errorMessageMode: mode,
        },
    );
}

export function register(params) {
    return defHttp.post({ url: Api.Register, params });
}
export function registerSms(params) {
    return defHttp.post({ url: Api.RegisterSms, params });
}
export function retrieveSms(params) {
    return defHttp.post({ url: Api.RetrieveSms, params });
}
export function retrieve(params) {
    return defHttp.post({ url: Api.Retrieve, params });
}
/**
 * @description: getUserInfo
 */
export function getUserInfo() {
    return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function doLogout() {
    return defHttp.get({ url: Api.Logout });
}

export function GetDepartmentInfo() {
    return defHttp.get({ url: Api.GetSystemDepartment });
}
export function getUserAll(params) {
    return defHttp.get({ url: Api.GetUser, params });
}
export function getSingleUser(id) {
    return defHttp.get<UserInfo>({ url: Api.GetUser + `${id}/` });
}
export function getUserFollow(params) {
    return defHttp.get<FollowResultModel>({ url: Api.GetFollow, params });
}
export function postUserFollow(params) {
    return defHttp.post({ url: Api.GetFollow, params });
}
export function getUserLike(params) {
    return defHttp.get({ url: Api.GetLike, params });
}
export function postUserInfo(params) {
    return defHttp.post({ url: Api.GetUserInfo, params });
}
