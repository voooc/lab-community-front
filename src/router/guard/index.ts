import { Router } from 'vue-router';
import nProgress from 'nprogress';

export function setupRouterGuard(router: Router) {
    fixMicro(router);
    fixParams(router);
    createProgressGuard(router);
}

export function fixMicro(router: Router) {
    if (window.__MICRO_APP_BASE_APPLICATION__) {
        let actived = true;
        router.beforeEach((_to, _from, next) => {
            if (!actived) {
                return;
            }
            next();
        });
        // 监听keep-alive模式下的应用状态
        window.addEventListener('appstate-change-SingleCell', (e: any) => {
            if (e.detail.appState === 'afterhidden') {
                actived = false;
            } else if (e.detail.appState === 'beforeshow') {
                actived = true;
                router.replace({ ...router.currentRoute.value, force: true });
            } else if (e.detail.appState === 'aftershow') {
                actived = true;
            }
        });
    }
}

export function fixParams(router: Router) {
    router.beforeEach((_to, _from, next) => {
        next();
    });
}

export function createProgressGuard(router: Router) {
    router.beforeEach(async (_from, _to, next) => {
        nProgress.start();
        next();
    });

    router.afterEach(async () => {
        nProgress.done();
        return true;
    });
}
