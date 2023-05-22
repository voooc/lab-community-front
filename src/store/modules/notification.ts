import { defineStore } from 'pinia';
import { store } from '@/store';
import { getUserUnreadMessage } from '@/api/notification';

interface Message {
    comment: number;
    like: number;
    system: number;
    follow: number;
}
interface NotificationState {
    unreadMessage: Message;
}
export const useNotificationStore = defineStore({
    id: 'notification',
    state: (): NotificationState => ({
        unreadMessage: { comment: 0, like: 0, system: 0, follow: 0 },
    }),
    getters: {
        getMessageUnread(): Message {
            return this.unreadMessage;
        },
    },
    actions: {
        async setUnreadCount() {
            const res = await getUserUnreadMessage();
            this.unreadMessage = res;
        },
    },
});

// Need to be used outside the setup
export function useNotificationStoreWithOut() {
    return useNotificationStore(store);
}
