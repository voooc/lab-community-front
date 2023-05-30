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
                        <a-menu-item key="synthesis">综合排序</a-menu-item>
                        <a-menu-item key="view">最热优先</a-menu-item>
                        <a-menu-item key="add_time">最新优先</a-menu-item>
                    </a-menu>
                </div>
                <ul class="article__list" ref="list" v-if="showList.length">
                    <li v-for="article in showList" :key="article.id" class="list__item h-139px">
                        <Item :source="article" />
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
    import Item from '@/views/article/list.vue';
    import { Skeleton } from 'ant-design-vue';
    import { onMounted, ref, reactive, onUnmounted, computed, watch } from 'vue';
    import { getArticleAll } from '@/api/article/index';
    import { ArticleResultModel, ArticleItem } from '@/models/article';
    import type { MenuProps } from 'ant-design-vue';
    import { useRoute } from 'vue-router';
    const orderSelectedKeys = ref<Array<string>>(['synthesis']);
    const showList = computed(() => {
        return data.articleInfoList.slice(data.start, data.end);
    });
    const route = useRoute();
    const getArticle = async () => {
        data.loading = true;
        const res: ArticleResultModel = await getArticleAll({
            page: data.page,
            pageSize: data.pageSize,
            ordering: orderSelectedKeys.value[0],
            query: route.query.query,
        });
        // // 防抖处理，防止数据加载过快，骨架一闪而过影响效果
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                data.loading = false;
                resolve('');
            }, 500);
        });
        promise.then(() => {
            data.articleInfoList.push(...res.items);
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
        articleInfoList: [],
        page: 1, // 当前页
        pageSize: 20, // 每页记录数
        itemHeight: 139, //每一列的高度
        showNum: 10, //显示几条数据
        start: 0, //滚动过程显示的开始索引
        end: 10, //滚动过程显示的结束索引
        next: true,
    });
    function reset() {
        data.articleInfoList = [];
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
        articleInfoList: Array<ArticleItem>;
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
            scrollBar.value.style.height = data.itemHeight * data.articleInfoList.length + 'px';
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
        getArticle();
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
        }
    }
</style>
