<template>
    <div>
        <TitleImage />
        <div style="background-color: #fff">
            <div class="container">
                <div class="title">
                    <div style="font-weight: normal; font-size: 36px">荣誉奖项</div>
                    <div style="font-size: 18px; color: #999999">RESEARCH FIELD</div>
                </div>
                <div class="content grid grid-cols-3 gap-10">
                    <div v-for="item in data" :key="item.id">
                        <a-card hoverable>
                            <template #cover>
                                <a-image :height="200" :src="item.image" />
                            </template>
                            <a-card-meta :title="item.name" :description="item.people" />
                        </a-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { GetAwards } from '@/api/news';
    import TitleImage from '../layout/index.vue';
    import { onMounted, ref } from 'vue';
    import { AwardResultModel, AwardModel } from '@/models/about';
    const data = ref<AwardModel[]>([]);
    onMounted(async () => {
        const res: AwardResultModel = await GetAwards({ page: 1, pageSize: 10000 });
        data.value = res.items;
    });
</script>
<style lang="less" scoped>
    .container {
        margin: 0 auto;
        text-align: center;

        .title {
            padding: 40px 0;
        }

        :deep(.ant-card) {
            .ant-image-img {
                height: 100%;
                object-fit: cover;
            }
        }
    }
</style>
