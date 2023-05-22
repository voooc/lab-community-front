import { BasicFetchResult } from '../base';

export interface ArticleResultModel {
    total: number;
    next: null | string;
    previous: null | string;
    items: Array<ArticleItem>;
}
export interface CommentItem {
    user: ArticleAuthor;
    image: string;
    id: string;
    created: string;
    content: string;
    reply_to: Nullable<ArticleAuthor>;
    comment: number;
    like: number;
    user_interface: {
        is_like: boolean;
    };
}
interface ArticleAuthor {
    email: string;
    id: string;
    image: string[];
    username: string;
    desc: string;
    department: string;
}
export interface TagItem {
    id: number | string;
    name: string;
}
export interface ArticleItem {
    id: string;
    author: ArticleAuthor;
    tags: Array<TagItem>;
    category: TagItem;
    add_time: string;
    title: string;
    desc: string;
    avatar: string;
    content: string;
    is_show: string;
    is_publish: string;
    code_highlight: string;
    preview: string;
    like: string | number;
    view: string | number;
    comment: string | number;
    user_interface: {
        is_like: boolean;
        is_follow: boolean;
    };
}
interface UserAction {
    is_like?: boolean;
    is_follow?: boolean;
}
export interface DiscussionModel {
    id: string;
    author: ArticleAuthor;
    comment: number;
    like: number;
    content: string;
    image: string[];
    add_time: string;
    user_interface: UserAction;
}
export type DiscussionResultModel = BasicFetchResult<DiscussionModel>;
