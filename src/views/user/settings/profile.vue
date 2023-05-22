<template>
    <div class="container main-container with-view-nav">
        <nav class="view-nav web-only">
            <div class="nav-text">
                <div @click="goBack">
                    <arrow-left-outlined />
                    返回
                </div>
            </div>
        </nav>
        <div class="placeholder-3"></div>
        <div class="view setting-view">
            <a-tabs tab-position="left" class="w-full">
                <template v-for="item in settingList" :key="item.key">
                    <a-tab-pane :tab="item.name">
                        <component :is="item.component" />
                    </a-tab-pane>
                </template>
            </a-tabs>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { settingList } from './data';
    import { ArrowLeftOutlined } from '@ant-design/icons-vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();
    function goBack() {
        router.go(-1);
    }
</script>
<style lang="less" scoped>
    .main-container {
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        position: relative;

        .view-nav {
            background-color: #fff;
            width: 100%;
            height: 2.7rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            margin: 24px auto 16px;
            padding-left: 22px;
            box-sizing: border-box;

            &::before {
                content: '';
                position: absolute;
                right: 0;
                bottom: 0;
                height: 200%;
                z-index: -1;
                left: 0;
                background-color: #fff;
            }

            .nav-text {
                cursor: pointer;
            }
        }

        .placeholder-3 {
            background-color: transparent;
            position: fixed;
            width: 100%;
            top: 130px;
            left: 8px;
            height: 16px;
            z-index: 2;
        }

        .setting-view {
            margin-top: 0px;
            width: 100%;
            display: flex;
            justify-content: space-between;

            :deep(.ant-tabs) {
                .ant-tabs-nav {
                    background-color: #fff;
                    border-radius: 4px;

                    .ant-tabs-nav-list {
                        padding: 8px;

                        .ant-tabs-ink-bar {
                            display: none;
                        }
                    }
                }

                .ant-tabs-tab {
                    color: #4e5969;

                    &-active {
                        background-color: #e8f3ff;
                        border-radius: 4px;

                        .ant-tabs-tab-btn {
                            color: #1d7dfa;
                        }
                    }
                }
            }
        }
    }
</style>
