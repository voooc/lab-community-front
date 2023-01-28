import { doLogout, getUserInfo, loginApi } from '@/api/sys/user';
import { TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { PageEnum } from '@/enums/pageEnum';
import { useMessage } from '@/hooks/web/useMessage';
import { store } from '@/store';
import { LoginParams } from '@/models/user';
import { UserInfo } from '@/models/user/user';
import { router } from '@/router';
import { setAuthCache } from '@/utils/auth';
import { defineStore } from 'pinia';
import { h } from 'vue';

import { useI18n } from 'vue-i18n';
interface UserState {
    userInfo: Nullable<UserInfo>;
    token?: string;
    sessionTimeout?: boolean;
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
    }),
    getters: {
        getUserInfo(): Nullable<UserInfo> {
            return this.userInfo || null;
        },
        getToken(): string {
            return this.token || '';
        },
        getSessionTimeout(): boolean {
            return !!this.sessionTimeout;
        },
    },
    actions: {
        setToken(info: string | undefined) {
            this.token = info ? info : '';
            setAuthCache(TOKEN_KEY, info);
        },
        setUserInfo(info: UserInfo | null) {
            this.userInfo = info;
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
                return this.afterLoginAction(true);
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async afterLoginAction(goHome?: boolean): Promise<UserInfo | null> {
            if (!this.getToken) return null;
            // get user info
            const userInfo = await this.getUserInfoAction();
            const sessionTimeout = this.sessionTimeout;
            if (sessionTimeout) {
                this.setSessionTimeout(false);
            } else {
                goHome && (await router.replace(PageEnum.BASE_HOME));
            }
            return userInfo;
        },
        async getUserInfoAction(): Promise<UserInfo | null> {
            if (!this.getToken) return null;
            const userInfo = await getUserInfo();
            this.setUserInfo(userInfo);
            return userInfo;
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
            const { t } = useI18n();
            createConfirm({
                iconType: 'warning',
                title: () => h('span', t('sys.app.logoutTip')),
                content: () => h('span', t('sys.app.logoutMessage')),
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
