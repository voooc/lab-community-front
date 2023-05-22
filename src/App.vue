<template>
    <ConfigProvider :locale="getAntdLocale">
        <keep-alive>
            <a-layout class="relative">
                <Header v-show="!route.meta.hideHeader && top < 150" :style="getHeaderStyle" />
                <a-layout style="min-height: calc(100vh - 200px)" id="innerView">
                    <div
                        class="flex-1 app-container"
                        ref="innerView"
                        :style="{
                            marginTop: marginTop,
                        }"
                    >
                        <div
                            :class="{ 'view-top': top >= 150 }"
                            v-if="secondMenus.length"
                            class="lab-header-second-menu"
                        >
                            <a-menu
                                v-model:selectedKeys="secondSelectedKeys"
                                mode="horizontal"
                                class="w-970px !m-auto"
                            >
                                <a-menu-item v-for="item in secondMenus" :key="item.titleKey">
                                    <router-link :to="{ name: item.titleKey }">{{
                                        item.title
                                    }}</router-link>
                                </a-menu-item>
                            </a-menu>
                        </div>
                        <Layout />
                    </div>
                    <a-back-top style="bottom: 10%; right: 60px" :target="getTarget">
                        <a-button
                            type="primary"
                            shape="circle"
                            size="large"
                            class="!flex items-center justify-center"
                            style="background-color: #1b6cf9"
                        >
                            <template #icon>
                                <ArrowUpOutlined />
                            </template>
                        </a-button>
                    </a-back-top>
                </a-layout>
                <Footer v-if="route.path !== '/editor/new' && route.path !== '/article'" />
            </a-layout>
        </keep-alive>
    </ConfigProvider>
</template>

<script lang="ts" setup>
    import { ConfigProvider } from 'ant-design-vue';
    import Layout from '@/views/layout/content/index.vue';
    import Header from '@/components/Header/index.vue';
    import Footer from '@/components/Footer/index.vue';
    import { ArrowUpOutlined } from '@ant-design/icons-vue';
    import { useLocale } from '@/locales/useLocale';
    import { useRoute } from 'vue-router';
    import { useHeaderSecondMenuStoreWithOut } from '@/store/modules/headerMenu';
    import { computed, watch, CSSProperties, onMounted, ref, onUnmounted } from 'vue';
    const secondMenuStore = useHeaderSecondMenuStoreWithOut();
    const route = useRoute();
    const { getAntdLocale } = useLocale();
    const marginTop = computed(() => {
        return secondMenuStore.getMarginTop;
    });
    const getTarget = () => document.getElementById('innerView');
    const secondSelectedKeys = computed({
        get: () => secondMenuStore.selectedKey,
        set: (val) => secondMenuStore.setSelectedKey(val),
    });
    const secondMenus = computed(() => {
        return secondMenuStore.getMenus;
    });
    const top = ref<number>(0);
    watch(
        () => [route.name, route.path, top.value],
        () => {
            if (route.path.split('/')[1]) {
                secondMenuStore.setMenus(route.path.split('/')[1]);
            }
            if (route.meta.group) {
                secondMenuStore.setSelectedKey([route.meta.group]);
            } else {
                route.name && secondMenuStore.setSelectedKey([route.name as string]);
            }
            const temp =
                (route.meta.hideHeader || top.value >= 150) && !secondMenus.value.length
                    ? '0px'
                    : !route.meta.hideHeader && top.value < 150 && secondMenus.value.length
                    ? '104px'
                    : !route.meta.hideHeader && top.value < 150
                    ? '64px'
                    : '40px';
            secondMenuStore.setMarginTop(temp);
            console.log(top.value);
        },
        { immediate: true },
    );
    const getHeaderStyle = computed(
        (): CSSProperties => ({
            boxShadow: top.value ? '0px 1px 10px 0px rgba(0, 0, 0, 0.1)' : 'none',
        }),
    );
    function getScollTop(e) {
        top.value = e.target.scrollTop;
    }
    onMounted(() => {
        window.addEventListener('scroll', getScollTop, true);
    });
    onUnmounted(() => {
        window.removeEventListener('scroll', getScollTop);
    });
</script>

<style lang="less" scoped>
    .app-container {
        :deep(.lab-header-second-menu) {
            position: fixed;
            z-index: 99;
            width: 100%;
            top: 64px;
            transition: all 0.3s;
            background-color: #fff;

            &.view-top {
                transform: translate3d(0, -64px, 0);
            }
        }

        &::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
            opacity: 0%;
        }
    }
</style>
