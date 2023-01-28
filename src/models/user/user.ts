import { BasicPageParams } from '../base';

export interface UserInfo {
    userId: string | number;
    // 用户名
    username: string;
    // 头像
    avatar: string;
    // 介绍
    desc?: string;
}

export interface ResponseUserInfo {
    islogin: boolean;
    user: UserInfo;
}

export interface LdapUserVO {
    cn: string;
    displayName: string;
    givenName: string;
    mail: string;
    samaccountName: string;
    sn: string;
}

export type LdapUserParams = BasicPageParams & {
    fuzzy: string;
};

export type GroupParams = BasicPageParams & {
    fuzzy: string;
};

export interface GroupVO {
    createBy: string;
    createTime: string;
    departCode: string;
    description: string;
    groupManager: string;
    groupName: string;
    id: number;
    level: number;
    parentId: number;
    subset: any[];
    updateBy: string;
    updateTime: string;
}
