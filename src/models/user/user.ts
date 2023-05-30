import { ArticleItem, DiscussionModel } from '../article';
import { BasicFetchResult } from '../base';
export interface UserInfo {
    id: string | number;
    // 用户名
    username: string;
    // 真实名字
    name: string;
    // 头像
    image: string;
    // 部门
    department: string;
    // 介绍
    desc?: string;
    // 角色
    roles: Array<string>;
    // email
    email: string;
    follow: number;
    fan: number;
    user_interface?: {
        is_follow: boolean;
    };
}
export interface FollowUserModel {
    email: string;
    id: number;
    image: string;
    username: string;
    desc: string;
}
export interface FollowItem {
    id: number;
    follow: FollowUserModel;
    fan: FollowUserModel;
    add_time: string;
    user_interface?: {
        is_follow: boolean;
    };
}
export type UserResultModel = BasicFetchResult<UserInfo>;
export interface MessageItem {
    id: number;
    user: UserInfo;
    to_user: UserInfo;
    message: string;
    url: string;
    type: string;
    has_read: boolean;
    add_time: string;
}
export type MessageResultModel = BasicFetchResult<MessageItem>;
export interface LikeItem {
    date: string;
    id: number | string;
    item: ArticleItem | DiscussionModel;
    user: UserInfo;
}
export type LikeResultModel = BasicFetchResult<LikeItem>;
