<template>
    <div>
        <TitleImage />
        <div style="background-color: #fff">
            <div class="container">
                <div class="title">
                    <div style="font-weight: normal; font-size: 36px">实验室环境</div>
                    <div style="font-size: 18px; color: #999999"> LAB ENVIROMENT </div>
                </div>
                <div class="content pb-60px">
                    <LazyContainer>
                        <div class="grid w-full h-full grid-cols-3 gap-5">
                            <a-image-preview-group>
                                <a-image
                                    v-for="item in imgList"
                                    :src="item"
                                    :key="item"
                                    class="!h-300px"
                                    style="object-fit: cover"
                                />
                            </a-image-preview-group>
                        </div>

                        <template #skeleton>
                            <Skeleton :rows="10" />
                        </template>
                    </LazyContainer>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import TitleImage from '../layout/index.vue';
    import { LazyContainer } from '@/components/Container/index';
    const imgList = ref<string[]>([]);
    onMounted(() => {
        const files = import.meta.glob('@/assets/images/enviroment/*', { import: 'default' });
        imgList.value = Object.keys(files);
    });
</script>
<style lang="less" scoped>
    .container {
        margin: 0 auto;
        text-align: center;

        .title {
            padding: 40px 0;
        }
    }
</style>
