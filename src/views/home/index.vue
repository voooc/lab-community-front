<template>
    <div>
        <swiper
            :pagination="{ clickable: true }"
            :autoplay="true"
            :modules="modules"
            class="my-swiper"
        >
            <swiper-slide v-for="item in banner" :key="item.id">
                <img :src="item.image" class="w-100vw h-500px" style="object-fit: cover" />
            </swiper-slide>
        </swiper>
        <div class="container my-25px mx-auto flex justify-between">
            <div class="left-news w-5/7">
                <div class="post">
                    <div class="title flex">
                        <h3>新闻动态 </h3>
                        <div class="more">
                            <router-link
                                :to="{
                                    path: '/news',
                                }"
                                class="text"
                            >
                                更多
                            </router-link>
                        </div>
                    </div>
                    <div class="content flex">
                        <div class="left w-300px" v-if="firstNews">
                            <div class="news_image max-h-217px">
                                <router-link
                                    :to="{
                                        name: 'news-detail',
                                        params: { id: firstNews.id },
                                    }"
                                >
                                    <img :src="firstNews.image" class="w-full max-h-217px" />
                                </router-link>
                            </div>
                            <div class="news_title">
                                <router-link
                                    :to="{
                                        name: 'news-detail',
                                        params: { id: firstNews.id },
                                    }"
                                    class="text"
                                >
                                    {{ firstNews.title }}
                                </router-link>
                            </div>
                            <div class="news_meta">{{ firstNews.add_time.split(' ')[0] }}</div>
                            <div class="news_text">
                                <router-link
                                    :to="{
                                        name: 'news-detail',
                                        params: { id: firstNews.id },
                                    }"
                                    class="text"
                                >
                                    {{ firstNews.desc }}
                                </router-link>
                            </div>
                        </div>
                        <div class="right flex-1 ml-25px">
                            <ul class="news_list">
                                <li v-for="temp in news" :key="temp.id" class="news_item">
                                    <span class="news_title">
                                        <router-link
                                            :to="{
                                                name: 'news-detail',
                                                params: { id: temp.id },
                                            }"
                                            class="text"
                                        >
                                            <span>{{ temp.title }}</span>
                                        </router-link>
                                    </span>
                                    <span class="news_meta">
                                        {{ temp.add_time.split(' ')[0] }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right ml-25px flex-1">
                <div class="notification">
                    <div class="post">
                        <div class="title">
                            <h3>通知公告 </h3>
                            <div class="more">
                                <router-link
                                    :to="{
                                        name: 'announcement',
                                    }"
                                    class="text"
                                >
                                    更多
                                </router-link>
                            </div>
                        </div>
                        <div class="content">
                            <div>
                                <ul class="news_list">
                                    <li
                                        v-for="temp in announcement"
                                        :key="temp.id"
                                        class="news_item"
                                    >
                                        <span class="news_title">
                                            <router-link
                                                :to="{
                                                    name: 'announcement-detail',
                                                    params: { id: temp.id },
                                                }"
                                                class="text"
                                            >
                                                <span
                                                    style="
                                                        white-space: nowrap;
                                                        width: 180px;
                                                        display: block;
                                                        overflow: hidden;
                                                        text-overflow: ellipsis;
                                                    "
                                                    >{{ temp.title }}</span
                                                >
                                            </router-link>
                                        </span>
                                        <span
                                            class="news_meta"
                                            style="margin-left: 20px; white-space: nowrap"
                                        >
                                            {{ temp.add_time.split(' ')[0] }}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';
    import 'swiper/css/pagination';
    import { Pagination, Navigation, Autoplay } from 'swiper';
    import { GetBanner, GetNews, GetAnnouncement } from '@/api/news';
    import { ref, onMounted, computed } from 'vue';
    import { BannerItem, BannerResultModel, NewsItem, NewsResultModel } from '@/models/news';
    const modules = [Pagination, Navigation, Autoplay];
    const banner = ref<Array<BannerItem>>([]);
    const news = ref<Array<NewsItem>>([]);
    const announcement = ref<Array<NewsItem>>([]);
    const firstNews = computed(() => {
        return news.value[0];
    });
    onMounted(async () => {
        const res1: BannerResultModel = await GetBanner({ page: 1, pageSize: 10 });
        const res2: NewsResultModel = await GetNews({ page: 1, pageSize: 10, is_published: true });
        const res3: NewsResultModel = await GetAnnouncement({
            page: 1,
            pageSize: 10,
            is_published: true,
        });
        banner.value = res1.items;
        news.value = res2.items;
        announcement.value = res3.items;
    });
</script>
<style lang="less" scoped>
    .post {
        box-shadow: 0px 6px 6px rgba(204, 204, 204, 0.8);

        .title {
            background-color: #11479a;
            height: 45px;
            line-height: 45px;
            padding: 0 35px;
            display: flex;
            justify-content: space-between;

            h3 {
                color: #fff;
                font-weight: 600;
            }

            .more {
                .text {
                    color: #fff;
                }
            }
        }

        .content {
            padding: 20px;

            .left {
                .news {
                    &_title {
                        margin-top: 10px;

                        .text {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: #333;
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }

                    &_meta {
                        color: #a6a6a6;
                        font-size: 15px;
                    }

                    &_text {
                        .text {
                            color: #a6a6a6;
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }

    .right {
        .news {
            &_item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            &_title {
                .text {
                    color: #333;
                    font-size: 16px;
                }
            }
        }
    }
</style>
