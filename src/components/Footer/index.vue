<template>
    <footer class="mt-25px">
        <div class="container">
            <div class="flex justify-around">
                <template v-for="item in menus" :key="item.titleKey">
                    <dl v-if="item.children">
                        <dt class="leading-45px text-xl">{{ item.title }}</dt>
                        <dd v-for="second in item.children" :key="second.titleKey">
                            <router-link :to="{ name: second.titleKey }">{{
                                second.title
                            }}</router-link>
                        </dd>
                    </dl>
                </template>
            </div>
            <div class="text-center">
                <div class="copy"> Copyright © 2023 value data实验室</div>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
    import { useHeaderMenuStoreWithOut } from '@/store/modules/headerMenu';
    import { computed } from 'vue';
    const menuStore = useHeaderMenuStoreWithOut();
    const menus = computed(() => menuStore.menus);
</script>
<style lang="less" scoped>
    .container {
        margin: 0 auto;
    }
</style>
