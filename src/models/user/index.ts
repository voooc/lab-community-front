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
    roles: RoleInfo[];
    // 用户id
    id: string | number;
    // 用户名
    userName: string;
    // 真实名字
    showName: string;
    // 头像
    avatar: string;
    // 介绍
    desc?: string;
    // 组
    groups: GroupItem[];
}

export interface GroupItem {
    name: string;
    id: string;
}
export interface UserInfo {
    id: string | number;
    userName: string;
    showName: string;
    avatar: string;
    roles: RoleInfo[];
    homePath?: string;
    groups: GroupItem[];
}
