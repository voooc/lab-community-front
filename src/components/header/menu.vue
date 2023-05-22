<template>
    <div>
        <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" class="lab-header-menu">
            <template v-for="item in menus" :key="item.titleKey">
                <a-menu-item v-if="!item.children" :key="item.titleKey">
                    <router-link :to="{ name: item.titleKey }">{{ item.title }}</router-link>
                </a-menu-item>
                <template v-else>
                    <a-sub-menu :key="item.titleKey">
                        <template #title>{{ item.title }}</template>
                        <a-menu-item v-for="second in item.children" :key="second.titleKey">
                            <router-link :to="{ name: second.titleKey }">{{
                                second.title
                            }}</router-link>
                        </a-menu-item>
                    </a-sub-menu>
                </template>
            </template>
        </a-menu>
    </div>
</template>
<script lang="ts">
    export default {
        name: 'Menu',
    };
</script>
<script lang="ts" setup>
    import { useHeaderMenuStoreWithOut } from '@/store/modules/headerMenu';
    import { computed, watch } from 'vue';
    import { useRoute } from 'vue-router';
    const menuStore = useHeaderMenuStoreWithOut();
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
