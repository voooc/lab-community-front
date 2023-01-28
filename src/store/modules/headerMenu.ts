import { defineStore } from 'pinia';
import { VNode, h } from 'vue';
import { AppstoreOutlined } from '@ant-design/icons-vue';
import { Icon } from '@/components/Icon';
export interface AppSideMenu {
    titleKey: string;
    title: string;
    icon: VNode;
    children?: any[];
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
                    titleKey: 'Home',
                    icon: h(Icon, { icon: AppstoreOutlined }),
                },
                {
                    title: '竞赛',
                    titleKey: 'Competition',
                    icon: h(Icon, { icon: AppstoreOutlined }),
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
