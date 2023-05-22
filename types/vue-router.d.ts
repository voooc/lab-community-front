export {};

declare module 'vue-router' {
    interface RouteMeta extends Record<string | number | symbol, unknown> {
        title: string;
        name?: string;
        icon?: string;
        frameSrc?: string;
        openOut?: boolean;
        picture?: string;
        appSrc?: string;
        baseRoute?: string;
        group?: string;
        subGroup?: string;
        hideHeader?: boolean;
    }
}
