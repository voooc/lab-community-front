<template>
    <div class="result-list">
        <div class="content middle">
            <Skeleton :loading="data.loading">
                <div class="sub-type-box">
                    <a-menu
                        v-model:selectedKeys="orderSelectedKeys"
                        mode="horizontal"
                        @click="handleOrder"
                    >
                        <a-menu-item key="view">浏览量</a-menu-item>
                        <a-menu-item key="add_time">发布时间</a-menu-item>
                    </a-menu>
                </div>
                <ul class="news__list" ref="list" v-if="showList.length">
                    <li v-for="article in showList" :key="article.id" class="news_item h-139px">
                        <div class="image">
                            <router-link
                                :to="{
                                    name: 'news-detail',
                                    params: { id: article.id },
                                }"
                            >
                                <span
                                    class="h-full w-full avatar"
                                    :style="{ 'background-image': `url(${article.image})` }"
                                ></span>
                            </router-link>
                        </div>
                        <div class="title">
                            <router-link
                                :to="{
                                    name: 'news-detail',
                                    params: { id: article.id },
                                }"
                            >
                                <div style="color: #333333">{{ article.title }}</div>
                            </router-link>
                        </div>
                        <p class="desc">
                            {{ article.desc }}
                        </p>
                        <p>
                            <span class="date">
                                <field-time-outlined />
                                发布时间：{{ article.add_time.split(' ')[0] }}
                            </span>
                        </p>
                    </li>
                </ul>
                <div v-else class="items-center flex justify-center h-300px">
                    <a-empty />
                </div>
            </Skeleton>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { onMounted, ref, reactive, onUnmounted, computed, watch } from 'vue';
    import type { MenuProps } from 'ant-design-vue';
    import { Skeleton } from 'ant-design-vue';
    import { useRoute } from 'vue-router';
    import { NewsItem, NewsResultModel } from '@/models/news';
    import { GetNews } from '@/api/news';
    const orderSelectedKeys = ref<Array<string>>(['view']);
    const showList = computed(() => {
        return data.newsInfoList.slice(data.start, data.end);
    });
    const route = useRoute();
    const getArticle = async () => {
        data.loading = true;
        const res: NewsResultModel = await GetNews({
            page: data.page,
            pageSize: data.pageSize,
            query: route.query.query,
            is_published: true,
        });
        // // 防抖处理，防止数据加载过快，骨架一闪而过影响效果
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                data.loading = false;
                resolve('');
            }, 500);
        });
        promise.then(() => {
            data.newsInfoList.push(...res.items);
            data.next = res.next ? true : false;
        });
    };
    const handleOrder: MenuProps['onClick'] = (menuInfo) => {
        orderSelectedKeys.value[0] = menuInfo.key as string;
        reset();
        getArticle();
    };
    const data = reactive<DataModel>({
        loading: true,
        newsInfoList: [],
        page: 1, // 当前页
        pageSize: 20, // 每页记录数
        itemHeight: 139, //每一列的高度
        showNum: 10, //显示几条数据
        start: 0, //滚动过程显示的开始索引
        end: 10, //滚动过程显示的结束索引
        next: true,
    });
    function reset() {
        data.newsInfoList = [];
        data.page = 1;
        data.pageSize = 20;
        data.itemHeight = 139;
        data.showNum = 10;
        data.start = 0;
        data.end = 10;
        data.next = true;
    }
    watch(
        () => route.query,
        () => {
            reset();
            getArticle();
        },
        { immediate: true },
    );
    interface DataModel {
        loading: boolean;
        newsInfoList: Array<NewsItem>;
        page: number;
        pageSize: number;
        itemHeight: number;
        showNum: number;
        start: number;
        end: number;
        next: boolean;
    }
    function lasyLoading(e) {
        let scrollTop = e.target.scrollTop || document.body.scrollTop;
        let clientHeight = e.target.clientHeight;
        let scrollHeight = e.target.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
            if (data.next) {
                data.page++;
                getArticle();
            }
        }
        scrollListener(scrollTop);
    }
    const scrollBar = ref();
    const list = ref();
    function scrollListener(scrollTop) {
        if (scrollBar.value) {
            //计算总的数据需要的高度，构造滚动条高度
            scrollBar.value.style.height = data.itemHeight * data.newsInfoList.length + 'px';
            //开始的数组索引
            let first = Math.floor(scrollTop / data.itemHeight) - 1;
            data.start = first < 0 ? 0 : first;
            //结束索引
            data.end = data.start + data.showNum;
            //计算上滚动区域的高度
            list.value.style.marginTop = data.start * data.itemHeight + 'px';
        }
    }
    onMounted(async () => {
        window.addEventListener('scroll', lasyLoading, true);
    });
    onUnmounted(() => {
        window.removeEventListener('scroll', lasyLoading);
    });
</script>
<style lang="less" scoped>
    .result-list {
        max-width: 750px;
        width: 100%;
        margin: 70px auto 0px;
        background-color: #fff;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

        .content {
            background-color: #fff;

            .news {
                &_item {
                    box-sizing: content-box;
                    color: #808080;
                    text-align: left;
                    position: relative;
                    border-bottom: 1px dashed #ebebeb;
                    padding: 20px 0 0 130px;
                    height: 100px;
                    transition: all 0.2s linear;
                    animation-name: fadeIn;
                    animation-duration: 1s;
                    animation-fill-mode: both;

                    &:hover {
                        padding-left: 180px;

                        .image {
                            left: 40px;
                        }
                    }

                    .image {
                        left: 40px;
                        position: absolute;
                        top: 20px;
                        width: 80px;
                        height: 80px;
                        text-align: center;
                        transition: all 0.2s linear;
                        cursor: pointer;
                        zoom: 1;
                        overflow: hidden;

                        .avatar {
                            background-position: center center;
                            background-repeat: no-repeat;
                            background-size: cover;
                            position: absolute;
                            left: 0px;
                            top: 0px;
                            opacity: 1;
                            transition: opacity 0.35s, transform 0.35s;
                        }

                        &:hover {
                            .avatar {
                                transform: scale3d(1.2, 1.2, 1);
                                top: 0px;
                                left: 0px;
                            }
                        }
                    }

                    .title {
                        padding-bottom: 10px;
                        font-size: 20px;
                        display: block;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .desc {
                        -webkit-line-clamp: 2;
                        margin-bottom: 5px;
                        overflow: hidden;
                        word-break: normal;
                        text-align: justify;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                    }
                }
            }
        }
    }
</style>
