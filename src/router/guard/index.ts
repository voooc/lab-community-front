import type { Router, RouteLocationNormalized } from 'vue-router';
import { AxiosCanceler } from '@/utils/http/axios/axiosCancel';
import { Modal, notification } from 'ant-design-vue';
import { warn } from '@/utils/log';
import projectSetting from '@/settings/projectSetting';

// Don't change the order of creation
export function setupRouterGuard(router: Router) {
    createHttpGuard(router);
    createScrollGuard(router);
    createMessageGuard(router);
}

/**
 * The interface used to close the current page to complete the request when the route is switched
 * @param router
 */
function createHttpGuard(router: Router) {
    const { removeAllHttpPending } = projectSetting;
    let axiosCanceler: Nullable<AxiosCanceler>;
    if (removeAllHttpPending) {
        axiosCanceler = new AxiosCanceler();
    }
    router.beforeEach(async () => {
        // Switching the route will delete the previous request
        axiosCanceler?.removeAllPending();
        return true;
    });
}

// Routing switch back to the top
function createScrollGuard(router: Router) {
    const isHash = (href: string) => {
        return /^#/.test(href);
    };

    const body = document.body;

    router.afterEach(async (to) => {
        // scroll top
        isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);
        return true;
    });
}

/**
 * Used to close the message instance when the route is switched
 * @param router
 */
export function createMessageGuard(router: Router) {
    const { closeMessageOnSwitch } = projectSetting;

    router.beforeEach(async () => {
        try {
            if (closeMessageOnSwitch) {
                Modal.destroyAll();
                notification.destroy();
            }
        } catch (error) {
            warn('message guard error:' + error);
        }
        return true;
    });
}
