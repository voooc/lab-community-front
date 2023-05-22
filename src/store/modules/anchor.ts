import { defineStore } from 'pinia';
import { store } from '@/store';

interface AnchorState {
    el: string;
    scroll: boolean;
}
export const useAnchorStore = defineStore({
    id: 'anchor',
    state: (): AnchorState => ({
        el: '#comment',
        scroll: false,
    }),
    actions: {
        setEl(element: string) {
            this.el = element;
        },
        goAnchor(): void {
            (document.querySelector(this.el) as Element).scrollIntoView({
                behavior: 'smooth',
            });
            this.scroll = false;
        },
    },
});

// Need to be used outside the setup
export function useAnchorStoreWithOut() {
    return useAnchorStore(store);
}
