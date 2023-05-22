<template>
    <div>
        <TitleImage />
        <div style="background-color: #fff">
            <div class="container flex">
                <div class="left">
                    <div style="background-color: #2190f6; color: #fff" class="h-30px leading-30px"
                        >科学研究</div
                    >
                    <a-menu
                        v-model:selectedKeys="selectedKeys"
                        style="width: 256px"
                        mode="vertical"
                        @click="handleClick"
                    >
                        <a-menu-item key="research">荣誉奖项</a-menu-item>
                        <a-menu-item key="announcement">通知公告</a-menu-item>
                    </a-menu>
                </div>
                <div class="right flex-1">
                    <h1 class="title">通知公告</h1>
                    <div class="content">
                        <ul>
                            <li v-for="item in announcement" :key="item.id">
                                <div class="divide"></div>
                                <router-link
                                    :to="{
                                        name: 'announcement-detail',
                                        params: { id: item.id },
                                    }"
                                    class="text flex"
                                    style="color: #333333"
                                >
                                    <div class="flag"></div>
                                    <div class="flex flex-1 justify-between">
                                        <div>{{ item.title }}</div>
                                        <div>{{ item.add_time.split(' ')[0] }}</div>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <a-pagination
                        v-model:current="data.current"
                        show-quick-jumper
                        :total="data.total"
                        @change="onChange"
                        class="mt-25px"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { GetAnnouncement } from '@/api/news';
    import TitleImage from '../layout/index.vue';
    import { NewsItem, NewsResultModel } from '@/models/news';
    import { MenuProps } from 'ant-design-vue';
    import { onMounted, reactive, ref } from 'vue';
    import { useRouter } from 'vue-router';
    const announcement = ref<Array<NewsItem>>([]);
    const data = reactive({
        page: 1,
        pageSize: 10,
        current: 1,
        total: 1,
    });
    const selectedKeys = ref<string[]>(['announcement']);
    const onChange = (page: number, pageSize: number) => {
        data.page = page;
        data.pageSize = pageSize;
        getData();
    };
    const router = useRouter();
    const handleClick: MenuProps['onClick'] = (menuInfo) => {
        router.push({ name: menuInfo.key as string });
    };
    async function getData() {
        const res: NewsResultModel = await GetAnnouncement({
            page: data.page,
            pageSize: data.pageSize,
        });
        announcement.value = res.items;
        data.total = res.total;
    }
    onMounted(async () => {
        getData();
    });
</script>
<style lang="less" scoped>
    .container {
        padding: 20px 0px;
        margin: 0 auto;
        text-align: center;

        .title {
            color: #071b62;
            margin-bottom: 10px;
            font-size: 25px;
        }

        .content {
            margin: 0 auto;
            width: 75%;

            li {
                .divide {
                    height: 1px;
                    background-color: #8080803d;
                    margin-bottom: 10px;
                }

                .flag {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: orange;
                    margin-right: 10px;
                    margin-top: 8px;
                }
            }
        }
    }
</style>
