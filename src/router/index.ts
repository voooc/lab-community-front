import type { App } from 'vue';

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { setupRouterGuard } from './guard';
import { basicRoutes } from './routes';

export function genRouter() {
    const router = createRouter({
        history: createWebHashHistory(),
        routes: basicRoutes as unknown as RouteRecordRaw[],
        strict: true,
        scrollBehavior: () => ({ left: 0, top: 0 }),
    });
    return router;
}

// config router
export function setupRouter(app: App<Element>) {
    const history = createWebHashHistory();
    const router = createRouter({
        history,
        routes: basicRoutes as unknown as RouteRecordRaw[],
        strict: true,
        scrollBehavior: () => ({ left: 0, top: 0 }),
    });
    app.use(router);
    setupRouterGuard(router);
    return { router, history };
}
