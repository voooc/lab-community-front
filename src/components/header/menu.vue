<template>
    <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" class="lab-header-menu">
        <a-menu-item v-for="item in menus" :key="item.titleKey">
            <router-link :to="{ name: item.titleKey }">{{ item.title }}</router-link>
        </a-menu-item>
    </a-menu>
</template>
<script lang="ts">
    export default {
        name: 'Menu',
    };
</script>
<script lang="ts" setup>
    import { useHeaderMenuStore } from '@/store/modules/headerMenu';
    import { computed, watch } from 'vue';
    import { useRoute } from 'vue-router';
    const menuStore = useHeaderMenuStore();
    const menus = computed(() => menuStore.menus);
    const selectedKeys = computed({
        get: () => menuStore.selectedKey,
        set: (val) => menuStore.setSelectedKey(val),
    });
    const route = useRoute();
    watch(
        () => route.name,
        () => {
            if (route.meta.group) {
                menuStore.setSelectedKey([route.meta.group]);
            } else {
                route.name && menuStore.setSelectedKey([route.name]);
            }
        },
    );
</script>
