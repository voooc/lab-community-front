<template>
    <ConfigProvider :locale="getAntdLocale">
        <a-layout>
            <a-layout>
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
    import LayoutContent from '../layout/content/index.vue';
    import { ConfigProvider } from 'ant-design-vue';
    import { useLocale } from '@/locales/useLocale';

    const { getAntdLocale } = useLocale();
</script>
