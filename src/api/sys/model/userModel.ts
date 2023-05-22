import { FollowItem, UserInfo } from '@/models/user/user';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
    email: string;
    password: string;
    remember: boolean;
}

export interface RoleInfo {
    roleName: string;
    value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
    token: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
    user: UserInfo;
}
export interface FollowResultModel {
    count: number;
    next: string;
    previous: string;
    items: Array<FollowItem>;
}
