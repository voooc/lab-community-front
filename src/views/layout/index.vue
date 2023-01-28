<template>
    <ConfigProvider :locale="getAntdLocale">
        <a-layout>
            <LayoutSideBar />
            <a-layout>
                <LayoutBreadcrumb />
                <LayoutContent />
            </a-layout>
        </a-layout>
    </ConfigProvider>
</template>
<script lang="ts">
    export default {
        name: 'Layout',
    };
</script>
<script lang="ts" setup>
    import LayoutSideBar from '../layout/sider/index.vue';
    import LayoutBreadcrumb from '../layout/breadcrumb/index.vue';
    import LayoutContent from '../layout/content/index.vue';
    import { ConfigProvider } from 'ant-design-vue';
    import { useLocale } from '@/locales/useLocale';

    const { getAntdLocale } = useLocale();
</script>
