import type { Router, RouteRecordRaw } from 'vue-router';

import { usePermissionStoreWithOut } from '@/store/modules/permission';

import { PageEnum } from '@/enums/pageEnum';
import { useUserStoreWithOut } from '@/store/modules/user';

import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';

import { RootRoute } from '@/router/routes';
import { createLocalStorage } from '@/utils/cache';
import { PREROUTE_HISTORY_KEY } from '@/enums/cacheEnum';
const LOGIN_PATH = PageEnum.BASE_LOGIN;

const ROOT_PATH = RootRoute.path;

const whitePathList: string[] = [
    'login',
    'news',
    'news-detail',
    'scienist',
    'announcement',
    'announcement-detail',
    'about',
    'overview',
    'people',
    'contact',
    'research',
    'article',
    'home',
    'article-item',
    'user-center',
    'user-article',
    'user-follow',
    'user-like',
    'search',
    'discussion',
    'discussion-item',
];

export function createPermissionGuard(router: Router) {
    const userStore = useUserStoreWithOut();
    const ls = createLocalStorage();
    const permissionStore = usePermissionStoreWithOut();
    router.beforeEach(async (to, from, next) => {
        if (to.path == PageEnum.BASE_LOGIN) {
            ls.set(PREROUTE_HISTORY_KEY, from.fullPath);
        }
        if (from.path === ROOT_PATH && to.path === PageEnum.BASE_HOME) {
            next();
            return;
        }

        const token = userStore.getToken;

        // Whitelist can be directly entered
        if (whitePathList.includes(to.name as string)) {
            if (to.path === LOGIN_PATH && token) {
                const isSessionTimeout = userStore.getSessionTimeout;
                try {
                    await userStore.afterLoginAction();
                    if (!isSessionTimeout) {
                        next((to.query?.redirect as string) || '/');
                        return;
                    }
                } catch {}
            }
            next();
            return;
        }
        // token or user does not exist
        if (!token) {
            // You can access without permission. You need to set the routing meta.ignoreAuth to true
            if (to.meta.ignoreAuth) {
                next();
                return;
            }

            // redirect login page
            const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
                path: LOGIN_PATH,
                replace: true,
            };
            if (to.path) {
                redirectData.query = {
                    ...redirectData.query,
                    redirect: to.path,
                };
            }
            next(redirectData);
            return;
        }

        // Jump to the 404 page after processing the login
        if (
            from.path === LOGIN_PATH &&
            to.name === PAGE_NOT_FOUND_ROUTE.name &&
            to.fullPath !== PageEnum.BASE_HOME
        ) {
            next(PageEnum.BASE_HOME);
            return;
        }

        // get userinfo while last fetch time is empty
        if (userStore.getLastUpdateTime === 0) {
            try {
                await userStore.getUserInfoAction();
            } catch (err) {
                next();
                return;
            }
        }

        if (permissionStore.getIsDynamicAddedRoute) {
            next();
            return;
        }

        const routes = await permissionStore.buildRoutesAction();

        routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
        });

        router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

        permissionStore.setDynamicAddedRoute(true);

        if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
            // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
            next({ path: to.fullPath, replace: true, query: to.query });
        } else {
            const redirectPath = (from.query.redirect || to.path) as string;
            const redirect = decodeURIComponent(redirectPath);
            const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
            next(nextData);
        }
    });
}
