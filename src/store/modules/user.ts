import { doLogout, getUserInfo, loginApi } from '@/api/sys/user';
import { PREROUTE_HISTORY_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { PageEnum } from '@/enums/pageEnum';
import { useMessage } from '@/hooks/web/useMessage';
import { store } from '@/store';
import { LoginParams } from '@/models/user';
import { UserInfo } from '@/models/user/user';
import { router } from '@/router';
import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { usePermissionStore } from '@/store/modules/permission';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { h } from 'vue';
import { createLocalStorage } from '@/utils/cache';
interface UserState {
    userInfo: Nullable<UserInfo>;
    token?: string;
    sessionTimeout?: boolean;
    lastUpdateTime: number;
}
export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        // 用户信息
        userInfo: null,
        // token
        token: undefined,
        // 登录是否超期失效
        sessionTimeout: false,
        lastUpdateTime: 0,
    }),
    getters: {
        getUserInfo(): UserInfo {
            return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
        },
        getToken(): string {
            return this.token || getAuthCache<string>(TOKEN_KEY);
        },
        getSessionTimeout(): boolean {
            return !!this.sessionTimeout;
        },
        getLastUpdateTime(): number {
            return this.lastUpdateTime;
        },
    },
    actions: {
        setToken(info: string | undefined) {
            this.token = info ? info : '';
            setAuthCache(TOKEN_KEY, info);
        },
        setUserInfo(info: UserInfo | null) {
            this.userInfo = info;
            this.lastUpdateTime = new Date().getTime();
            setAuthCache(USER_INFO_KEY, info);
        },
        setSessionTimeout(flag: boolean) {
            this.sessionTimeout = flag;
        },
        resetState() {
            this.userInfo = null;
            this.token = '';
            this.sessionTimeout = false;
        },
        async login(params: LoginParams) {
            try {
                const { ...loginParams } = params;
                const data = await loginApi(loginParams);
                const { token } = data;
                this.setToken(token);
                return this.afterLoginAction();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async afterLoginAction(): Promise<UserInfo | null> {
            if (!this.getToken) return null;
            // get user info
            const userInfo = await this.getUserInfoAction();
            const sessionTimeout = this.sessionTimeout;
            if (sessionTimeout) {
                this.setSessionTimeout(false);
            } else {
                const permissionStore = usePermissionStore();
                if (!permissionStore.isDynamicAddedRoute) {
                    const routes = await permissionStore.buildRoutesAction();
                    routes.forEach((route) => {
                        router.addRoute(route as unknown as RouteRecordRaw);
                    });
                    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
                    permissionStore.setDynamicAddedRoute(true);
                }
            }
            const ls = createLocalStorage();
            const lastPath = ls.get(PREROUTE_HISTORY_KEY);
            let path = PageEnum.BASE_HOME;
            if (lastPath && lastPath !== '/login' && lastPath != '/') {
                path = lastPath;
            }
            await router.replace(path);
            return userInfo;
        },
        async getUserInfoAction(): Promise<UserInfo | null> {
            if (!this.getToken) return null;
            const userInfo = await getUserInfo();
            this.setUserInfo(userInfo.user);
            return userInfo.user;
        },
        async logout(goLogin = false) {
            if (this.getToken) {
                try {
                    await doLogout();
                } catch {
                    console.log('注销Token失败');
                }
            }
            this.setToken(undefined);
            this.setSessionTimeout(false);
            this.setUserInfo(null);
            goLogin && router.push(PageEnum.BASE_LOGIN);
        },
        confirmLoginOut() {
            const { createConfirm } = useMessage();
            createConfirm({
                iconType: 'warning',
                title: () => h('span', '温馨提醒'),
                content: () => h('span', '是否退出系统'),
                onOk: async () => {
                    await this.logout(true);
                },
            });
        },
    },
});
export function useUserStoreWithOut() {
    return useUserStore(store);
}
