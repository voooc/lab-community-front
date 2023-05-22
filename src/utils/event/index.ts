import ResizeObserver from 'resize-observer-polyfill';

const isServer = typeof window === 'undefined';

/* istanbul ignore next */
function resizeHandler(entries: any[]) {
    for (const entry of entries) {
        const listeners = entry.target.__resizeListeners__ || [];
        if (listeners.length) {
            listeners.forEach((fn: () => any) => {
                fn();
            });
        }
    }
}

/* istanbul ignore next */
export function addResizeListener(element: any, fn: () => any) {
    if (isServer) return;
    if (!element.__resizeListeners__) {
        element.__resizeListeners__ = [];
        element.__ro__ = new ResizeObserver(resizeHandler);
        element.__ro__.observe(element);
    }
    element.__resizeListeners__.push(fn);
}

/* istanbul ignore next */
export function removeResizeListener(element: any, fn: () => any) {
    if (!element || !element.__resizeListeners__) return;
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
        element.__ro__.disconnect();
    }
}

export function triggerWindowResize() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, true);
    (event as any).eventType = 'message';
    window.dispatchEvent(event);
}
export function scrollFn(fetchData: Function) {
    //获取网页的总高度
    const htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    //clientHeight是网页在浏览器中的可视高度
    const clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
    //scrollTop是浏览器滚动条的top位置
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    //判断到底部了,为了避免一些问题，设置距离底部50px时就执行代码
    if (scrollTop + clientHeight > htmlHeight - 50) {
        fetchData();
    }
}
