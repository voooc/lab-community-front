import type { AppRouteRecordRaw, Menu } from '@/router/types';

import { defineStore } from 'pinia';
import { store } from '@/store';
import { useAppStoreWithOut } from './app';
import { flatMultiLevelRoutes } from '@/router/helper/routeHelper';

import projectSetting from '@/settings/projectSetting';

import { PermissionModeEnum } from '@/enums/appEnum';

import { asyncRoutes } from '@/router/routes';
import { PageEnum } from '@/enums/pageEnum';

interface PermissionState {
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: boolean;
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: number;
    // Backstage menu list
    // 菜单列表
    frontMenuList: Menu[];
}

export const usePermissionStore = defineStore({
    id: 'app-permission',
    state: (): PermissionState => ({
        // Whether the route has been dynamically added
        // 路由是否动态添加
        isDynamicAddedRoute: false,
        // To trigger a menu update
        // 触发菜单更新
        lastBuildMenuTime: 0,
        // menu List
        // 菜单列表
        frontMenuList: [],
    }),
    getters: {
        getFrontMenuList(): Menu[] {
            return this.frontMenuList;
        },
        getLastBuildMenuTime(): number {
            return this.lastBuildMenuTime;
        },
        getIsDynamicAddedRoute(): boolean {
            return this.isDynamicAddedRoute;
        },
    },
    actions: {
        setFrontMenuList(list: Menu[]) {
            this.frontMenuList = list;
        },

        setLastBuildMenuTime() {
            this.lastBuildMenuTime = new Date().getTime();
        },

        setDynamicAddedRoute(added: boolean) {
            this.isDynamicAddedRoute = added;
        },
        resetState(): void {
            this.isDynamicAddedRoute = false;
            this.lastBuildMenuTime = 0;
        },

        // 构建路由
        async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
            const appStore = useAppStoreWithOut();

            let routes: AppRouteRecordRaw[] = [];
            const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

            /**
             * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
             * */
            const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
                if (!routes || routes.length === 0) return;
                let homePath: string = PageEnum.BASE_HOME;

                function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
                    if (parentPath) parentPath = parentPath + '/';
                    routes.forEach((route: AppRouteRecordRaw) => {
                        const { path, children, redirect } = route;
                        const currentPath = path.startsWith('/') ? path : parentPath + path;
                        if (currentPath === homePath) {
                            if (redirect) {
                                homePath = route.redirect! as string;
                            } else {
                                route.meta = Object.assign({}, route.meta, { affix: true });
                                throw new Error('end');
                            }
                        }
                        children && children.length > 0 && patcher(children, currentPath);
                    });
                }

                try {
                    patcher(routes);
                } catch (e) {
                    // 已处理完毕跳出循环
                }
                return;
            };

            switch (permissionMode) {
                // 路由映射， 默认进入该case
                case PermissionModeEnum.ROUTE_MAPPING:
                    routes = asyncRoutes;
                    // 将多级路由转换为 2 级路由
                    routes = flatMultiLevelRoutes(routes);
                    break;
            }
            patchHomeAffix(routes);
            return routes;
        },
    },
});

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
    return usePermissionStore(store);
}
