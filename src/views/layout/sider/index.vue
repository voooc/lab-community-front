<template>
    <a-layout-sider theme="light" style="height: 100vh" width="250px" v-if="false && !isMicroApp">
        <div class="sider-title">{{ title }}</div>
        <a-menu mode="inline" v-model:selectedKeys="selectedKey" v-model:openKeys="openKeys">
            <a-sub-menu v-for="menu in menus" :key="menu.name">
                <template #title>{{ menu.title }}</template>
                <a-menu-item v-for="item in menu.children" :key="item.name">
                    <router-link :to="{ name: item.name }">{{ item.title }}</router-link>
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </a-layout-sider>
</template>
<script lang="ts" setup>
    import { ref, watch } from 'vue';
    import { routeModuleList } from '@/router/routes';
    import { useRoute, useRouter } from 'vue-router';
    import { error } from '@/utils/log';
    import { useI18n } from '@/hooks/web/useI18n';

    const { t } = useI18n();
    const route = useRoute();
    const title = ref('Task');
    const selectedKey = ref(['']);
    const menus = routeModuleList.map((routeModule) => {
        return {
            name: routeModule.name,
            title: routeModule?.meta.title,
            children: Array.isArray(routeModule.children)
                ? routeModule.children
                      .filter((route) => !(route.meta && route.meta.hideMenu))
                      .map((route) => {
                          return {
                              name: route.name,
                              path: route.path,
                              title: route.meta?.title || route.name,
                          };
                      })
                : [],
        };
    });

    const openKeys = menus.map((menu) => menu.name);

    const router = useRouter();

    // @ts-ignore
    const isMicroApp = ref(window.__MICRO_APP_BASE_APPLICATION__);
    try {
        if (isMicroApp.value && import.meta.env.VITE_SUB_APP_SIDE === 'true') {
            const eventCenter = window['eventCenterForTargetEva'].getData();
            // FIXME: 后续支持多个多级tab
            const microSide = {
                title: t('global.title'),
                children: [
                    {
                        title: t('global.sider.index'),
                        name: 'Index',
                    },
                    {
                        title: t('global.sider.graphIndex'),
                        name: 'GraphIndex',
                    },
                    {
                        title: t('global.sider.graphSearch'),
                        name: 'GraphSearch',
                    },
                ],
            };
            const target = microSide.children.find((item) => item.name === route.name);
            // 实际开发时需要替换成对应的app name
            // @ts-ignore
            eventCenter.setSideBar({
                title: microSide.title,
                selectedKey: target ? [target.name] : [microSide.children[0].name],
                sideList: microSide.children.map((item) => {
                    return {
                        title: item.title,
                        key: item.name,
                        go() {
                            router.push({ name: item.name });
                        },
                    };
                }),
            });
            watch(
                () => route.name,
                (name: string) => {
                    if (route.meta.currentActiveMenu) {
                        eventCenter.setSelected([route.meta.currentActiveMenu]);
                    } else {
                        eventCenter.setSelected([name]);
                    }
                },
                {
                    immediate: true,
                },
            );
        } else {
            watch(
                () => route.name,
                (name: string) => {
                    selectedKey.value = [name];
                    if (route.meta.currentActiveMenu) {
                        selectedKey.value = [route.meta.currentActiveMenu];
                    } else {
                        selectedKey.value = [name];
                    }
                },
                {
                    immediate: true,
                },
            );
        }
    } catch (e) {
        error((e as Error).message);
    }
</script>
<script lang="ts">
    export default {
        name: 'LayoutSideBar',
    };
</script>

<style lang="less" scoped>
    .sider-title {
        padding: 10px;
        text-align: center;
        font-size: 18px;
    }
</style>
