import { onDeactivated, onUnmounted } from 'vue';

export function onUnMountedOrDeAativated(hook: Fn) {
    onUnmounted(() => {
        hook();
    });

    onDeactivated(() => {
        hook();
    });
}
