<template>
    <div style="background-color: #fff">
        <div class="container">
            <div class="title"></div>
            <div class="content">
                <a-skeleton :loading="data.loading" class="news">
                    <ul class="news_list" ref="list" v-if="showList.length">
                        <li v-for="article in showList" :key="article.id" class="news_item">
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
                    <div
                        v-else
                        style="height: calc(100vh - 64px - 20px - 20px)"
                        class="items-center flex justify-center"
                    >
                        <a-empty />
                    </div>
                </a-skeleton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref, computed, reactive, onUnmounted } from 'vue';
    import { GetNews } from '@/api/news/index';
    import { FieldTimeOutlined } from '@ant-design/icons-vue';
    import { NewsItem, NewsResultModel } from '@/models/news';
    const showList = computed(() => {
        return data.newsInfoList.slice(data.start, data.end);
    });
    const getNews = async (page = data.page, pageSize = data.pageSize) => {
        data.page = page;
        data.pageSize = pageSize;
        const res: NewsResultModel = await GetNews({
            page: page,
            pageSize: pageSize,
        });
        // // 防抖处理，防止数据加载过快，骨架一闪而过影响效果
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                data.loading = false;
                resolve('');
            }, 500);
        });
        promise.then(() => {
            data.newsInfoList = res.items;
            data.next = res.next ? true : false;
        });
    };
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
    function lazyLoading(e) {
        console.log('sss');
        let scrollTop = e.target.scrollTop || document.body.scrollTop;
        let clientHeight = e.target.clientHeight;
        let scrollHeight = e.target.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
            if (data.next) {
                data.page++;
                getNews();
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
        getNews();
        window.addEventListener('scroll', lazyLoading, true);
    });
    onUnmounted(() => {
        window.removeEventListener('scroll', lazyLoading);
    });
</script>
<style lang="less" scoped>
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }

    .container {
        background-color: #fff;
        min-height: calc(100vh - 64px);
        margin: 0 auto;
    }

    .content {
        .news {
            &_item {
                box-sizing: content-box;
                color: #808080;
                text-align: left;
                position: relative;
                border-bottom: 1px dashed #ebebeb;
                padding: 50px 0 0 321px;
                height: 249px;
                transition: all 0.2s linear;
                animation-name: fadeIn;
                animation-duration: 1s;
                animation-fill-mode: both;

                &:hover {
                    padding-left: 361px;

                    .image {
                        left: 40px;
                    }
                }

                .image {
                    left: 40px;
                    position: absolute;
                    top: 50px;
                    width: 260px;
                    height: 210px;
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
                    padding: 27px 0 20px;
                    font-size: 20px;
                    display: block;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .desc {
                    -webkit-line-clamp: 2;
                    height: 48px;
                    margin-bottom: 43px;
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
</style>
