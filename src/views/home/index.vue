<template>
    <div>
        <swiper
            :pagination="{ clickable: true }"
            :autoplay="true"
            :modules="modules"
            class="my-swiper"
        >
            <swiper-slide>
                <img src="@/assets/images/demo.png" class="w-100vw h-500px" />
            </swiper-slide>
            <swiper-slide>
                <img src="@/assets/images/swiper1.jpg" class="w-100vw h-500px" />
            </swiper-slide>
            <swiper-slide>
                <img src="@/assets/images/demo.png" class="w-100vw h-500px" />
            </swiper-slide>
        </swiper>
        <div class="mx-10px">
            <div class="title">最新动态</div>
            <div class="content grid grid-cols-3 gap-2">
                <div v-for="(item, index) in news" :key="index">
                    <a class="relative">
                        <span class="pic">
                            <img :src="item.img" />
                        </span>
                        <span class="title absolute bottom-0px right-0px left-0px text-center">
                            {{ item.title }}
                        </span>
                    </a>
                </div>
            </div>
        </div>
        <div>
            <div class="title">核心团队</div>
            <div class="content"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';
    import 'swiper/css/pagination';
    import { Pagination, Navigation, Autoplay } from 'swiper';
    import BgOa from '@/assets/images/demo.png';
    const modules = [Pagination, Navigation, Autoplay];
    const news = [
        {
            img: BgOa,
            title: '123',
            id: 1,
        },
        {
            img: BgOa,
            title: '123',
            id: 2,
        },
        {
            img: BgOa,
            title: '123',
            id: 3,
        },
    ];
</script>
<style lang="less" scoped></style>
