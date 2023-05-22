<!--新鲜事的loading骨架图-->
<template>
    <div class="skeleton-wrapper">
        <div v-for="item in skeletonNum" class="skeleton-pin" :key="item">
            <div class="header">
                <div class="avatar"> </div>
                <div class="info">
                    <div class="skeleton-row"></div>
                    <div class="skeleton-row"></div>
                </div>
            </div>
            <div class="body">
                <div class="skeleton-row"></div>
                <div class="skeleton-row"></div>
                <div class="skeleton-row"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    const skeletonNum = ref(3);
</script>

<style scoped lang="less">
    .skeleton-wrapper {
        width: 100%;

        .skeleton-pin {
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            margin-bottom: 12px;
            padding: 16px 24px;
            box-sizing: border-box;
            background-color: #fff;

            .header {
                display: flex;
                align-items: center;

                .avatar {
                    width: 45px;
                    height: 45px;
                    background-color: #f3f3f3;
                    border-radius: 50%;
                    margin-right: 10px;
                }

                .info {
                    width: 100px;
                    padding-top: 10px;
                }
            }

            .body {
                margin-top: 10px;
                padding-left: 55px;
            }

            .skeleton-row {
                background-color: #f3f3f3;
                margin-bottom: 10px;
                width: 100%;
                height: 14px;
            }
        }
    }
</style>
