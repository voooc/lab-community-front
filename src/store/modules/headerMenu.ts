import { defineStore } from 'pinia';
import { store } from '@/store';
export interface AppSideMenu {
    titleKey: string;
    title: string;
    children?: AppSideMenu[];
}

export interface HeaderMenuState {
    selectedKey: string[];
    menus: AppSideMenu[];
    timer: any;
    currentHoverMenu: Nullable<AppSideMenu>;
}
export const useHeaderMenuStore = defineStore('HeaderMenu', {
    state: (): HeaderMenuState => {
        return {
            timer: null,
            selectedKey: [],
            currentHoverMenu: null,
            menus: [
                {
                    title: '首页',
                    titleKey: 'home',
                },
                {
                    title: '新闻动态',
                    titleKey: 'news',
                },
                {
                    title: '科学研究',
                    titleKey: 'scientist',
                    children: [
                        {
                            title: '荣誉奖项',
                            titleKey: 'research',
                        },
                        {
                            title: '通知公告',
                            titleKey: 'announcement',
                        },
                    ],
                },
                {
                    title: '关于我们',
                    titleKey: 'about',
                    children: [
                        {
                            title: '实验室概况',
                            titleKey: 'overview',
                        },
                        {
                            title: '实验室成员',
                            titleKey: 'people',
                        },
                        {
                            title: '联系我们',
                            titleKey: 'contact',
                        },
                    ],
                },
                {
                    title: '文章',
                    titleKey: 'article',
                },
                {
                    title: '动态',
                    titleKey: 'discussion',
                },
            ],
        };
    },
    actions: {
        setSelectedKey(selectedKey: string[]) {
            this.selectedKey = selectedKey;
        },
        setHover(item: Nullable<AppSideMenu>) {
            clearTimeout(this.timer);
            this.currentHoverMenu = item;
        },
        setHoverLeave() {
            this.timer = setTimeout(() => {
                this.currentHoverMenu = null;
            }, 30);
        },
        setSubHover(item: Nullable<AppSideMenu>) {
            this.currentHoverMenu = item;
            clearTimeout(this.timer);
        },
        setSubHoverLeave() {
            this.timer = setTimeout(() => {
                this.currentHoverMenu = null;
            }, 30);
        },
    },
});
export interface HeaderSecondMenuState {
    selectedKey: string[];
    menus: AppSideMenu[];
    timer: any;
    currentHoverMenu: Nullable<AppSideMenu>;
    type: string;
    marginTop: string;
}
export const useHeaderSecondMenuStore = defineStore('HeaderSecondMenu', {
    state: (): HeaderSecondMenuState => {
        return {
            timer: null,
            selectedKey: [],
            currentHoverMenu: null,
            type: '',
            menus: [],
            marginTop: '0px',
        };
    },
    getters: {
        getMenus(): AppSideMenu[] {
            if (this.type === 'notification') {
                return [
                    {
                        title: '系统通知',
                        titleKey: 'notification-system',
                    },
                    {
                        title: '新增粉丝',
                        titleKey: 'notification-follow',
                    },
                    {
                        title: '评论',
                        titleKey: 'notification-comment',
                    },
                    {
                        title: '点赞',
                        titleKey: 'notification-like',
                    },
                ];
            } else {
                return [];
            }
        },
        getMarginTop(): string {
            return this.marginTop;
        },
    },
    actions: {
        setMenus(type: string) {
            this.type = type;
        },
        setSelectedKey(selectedKey: string[]) {
            this.selectedKey = selectedKey;
        },
        setHover(item: Nullable<AppSideMenu>) {
            clearTimeout(this.timer);
            this.currentHoverMenu = item;
        },
        setHoverLeave() {
            this.timer = setTimeout(() => {
                this.currentHoverMenu = null;
            }, 30);
        },
        setSubHover(item: Nullable<AppSideMenu>) {
            this.currentHoverMenu = item;
            clearTimeout(this.timer);
        },
        setSubHoverLeave() {
            this.timer = setTimeout(() => {
                this.currentHoverMenu = null;
            }, 30);
        },
        setMarginTop(value: string) {
            this.marginTop = value;
        },
    },
});
export function useHeaderMenuStoreWithOut() {
    return useHeaderMenuStore(store);
}
export function useHeaderSecondMenuStoreWithOut() {
    return useHeaderSecondMenuStore(store);
}
