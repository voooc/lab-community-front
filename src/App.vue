<template>
    <ConfigProvider prefixCls="lab-community" :locale="getAntdLocale">
        <a-layout class="relative">
            <Header />
            <a-layout
                :style="{
                    height: 'calc(100vh - 64px)',
                    marginTop: '64px',
                    overflowY: 'auto',
                }"
                id="innerView"
            >
                <div class="flex-1 app-container" ref="innerView">
                    <router-view />
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
        </a-layout>
    </ConfigProvider>
</template>

<script lang="ts" setup>
    import { ConfigProvider } from 'ant-design-vue';
    import Header from '@/components/header/index.vue';
    import { ArrowUpOutlined } from '@ant-design/icons-vue';
    import { useLocale } from '@/locales/useLocale';

    const { getAntdLocale } = useLocale();

    const getTarget = () => document.getElementById('innerView');
</script>

<style lang="less" scoped>
    .app-container {
        &::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
            opacity: 0%;
        }
    }

    .os-micro-layout.os-micro-layout-has-sider {
        flex-direction: inherit;
    }
</style>
