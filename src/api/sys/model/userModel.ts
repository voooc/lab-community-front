/**
 * @description: Login interface parameters
 */
export interface LoginParams {
    username: string;
    password: string;
}

export interface RoleInfo {
    roleName: string;
    value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
    userId: string | number;
    token: string;
    role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
    userId: string | number;
    // 用户名
    username: string;
    // 头像
    avatar: string;
    // 介绍
    desc?: string;
}
