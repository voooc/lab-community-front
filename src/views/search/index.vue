<template>
    <div>
        <div class="fixed w-full" :style="{ top: `${top}` }" style="background: #fff">
            <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" class="w-900px !m-auto">
                <a-menu-item v-for="item in menus" :key="item.key">{{ item.name }}</a-menu-item>
            </a-menu>
        </div>
        <component :is="currentComponent" v-if="currentComponent" />
    </div>
</template>
<script setup lang="ts">
    import { ref, computed } from 'vue';
    import Article from './article/index.vue';
    import User from './user/index.vue';
    import { useHeaderSecondMenuStoreWithOut } from '@/store/modules/headerMenu';
    const selectedKeys = ref<string[]>(['article']);
    const menus = [
        {
            key: 'article',
            name: '文章',
            component: Article,
        },
        {
            key: 'user',
            name: '用户',
            component: User,
        },
    ];
    const secondMenuStore = useHeaderSecondMenuStoreWithOut();
    const top = computed(() => {
        return secondMenuStore.marginTop;
    });
    const currentComponent = computed(() => {
        const key = selectedKeys.value[0];
        const menu = menus.find((item) => item.key === key);
        return menu ? menu.component : null;
    });
</script>
