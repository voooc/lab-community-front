// import { defineStore } from 'pinia';
// import { store } from '@/store';

// interface AppState {
//     pageLoading: boolean;
// }
// export const useAppStore = defineStore({
//     id: 'app',
//     state: (): AppState => ({
//         pageLoading: false,
//     }),
//     getters: {
//         getPageLoading(): boolean {
//             return this.pageLoading;
//         },
//     },
//     actions: {
//         setPageLoading(loading: boolean): void {
//             this.pageLoading = loading;
//         },
//     },
// });

// // Need to be used outside the setup
// export function useAppStoreWithOut() {
//     return useAppStore(store);
// }
import type {
    ProjectConfig,
    HeaderSetting,
    MenuSetting,
    TransitionSetting,
    MultiTabsSetting,
} from '/#/config';
import type { BeforeMiniState } from '/#/store';

import { defineStore } from 'pinia';
import { store } from '@/store';

import { PROJ_CFG_KEY } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';
import { resetRouter } from '@/router';
import { deepMerge } from '@/utils';

interface AppState {
    // Page loading status
    pageLoading: boolean;
    // project config
    projectConfig: ProjectConfig | null;
    // When the window shrinks, remember some states, and restore these states when the window is restored
    beforeMiniInfo: BeforeMiniState;
}
let timeId: TimeoutHandle;
export const useAppStore = defineStore({
    id: 'app',
    state: (): AppState => ({
        pageLoading: false,
        projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
        beforeMiniInfo: {},
    }),
    getters: {
        getPageLoading(): boolean {
            return this.pageLoading;
        },

        getBeforeMiniInfo(): BeforeMiniState {
            return this.beforeMiniInfo;
        },

        getProjectConfig(): ProjectConfig {
            return this.projectConfig || ({} as ProjectConfig);
        },

        getHeaderSetting(): HeaderSetting {
            return this.getProjectConfig.headerSetting;
        },
        getMenuSetting(): MenuSetting {
            return this.getProjectConfig.menuSetting;
        },
        getTransitionSetting(): TransitionSetting {
            return this.getProjectConfig.transitionSetting;
        },
        getMultiTabsSetting(): MultiTabsSetting {
            return this.getProjectConfig.multiTabsSetting;
        },
    },
    actions: {
        setPageLoading(loading: boolean): void {
            this.pageLoading = loading;
        },

        setBeforeMiniInfo(state: BeforeMiniState): void {
            this.beforeMiniInfo = state;
        },

        setProjectConfig(config: DeepPartial<ProjectConfig>): void {
            this.projectConfig = deepMerge(this.projectConfig || {}, config);
            Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig);
        },

        async resetAllState() {
            resetRouter();
            Persistent.clearAll();
        },
        async setPageLoadingAction(loading: boolean): Promise<void> {
            if (loading) {
                clearTimeout(timeId);
                // Prevent flicker
                timeId = setTimeout(() => {
                    this.setPageLoading(loading);
                }, 50);
            } else {
                this.setPageLoading(loading);
                clearTimeout(timeId);
            }
        },
    },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
    return useAppStore(store);
}
