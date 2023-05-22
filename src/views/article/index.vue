<template>
    <div class="pt-20px flex relative page-wrapper container index-container min-h-100vh">
        <main class="container main-container">
            <div class="contents__list flex justify-between w-full" ref="scrollBar">
                <div
                    class="sider-left left"
                    v-if="menu.length"
                    :style="{ top: `calc(20px + ${leftTop})` }"
                >
                    <a-menu v-model:selectedKeys="selectedKeys" style="width: 100%">
                        <a-menu-item :key="item.id" v-for="item in menu">
                            {{ item.name }}
                        </a-menu-item>
                    </a-menu>
                </div>
                <div class="main-container relative">
                    <div class="content middle">
                        <a-skeleton :loading="data.loading">
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
                                <li
                                    v-for="(article, index) in showList"
                                    :key="article.id"
                                    class="list__item h-139px"
                                >
                                    <List :source="article" :index="index" @delete="handleDelete" />
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
                    <div class="sider-right right">
                        <div class="fixed content" :style="{ top: `${leftTop}` }">
                            <NewArticle />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
<script lang="ts" setup>
    import List from './list.vue';
    import { onMounted, ref, watch, reactive, onUnmounted, computed } from 'vue';
    import NewArticle from './NewArticle.vue';
    import { getArticleCategory, getArticleAll } from '@/api/article/index';
    import { useHeaderSecondMenuStoreWithOut } from '@/store/modules/headerMenu';
    import { ArticleResultModel, ArticleItem } from '@/models/article';
    import type { MenuProps } from 'ant-design-vue';
    const secondMenuStore = useHeaderSecondMenuStoreWithOut();
    const leftTop = computed(() => {
        return secondMenuStore.marginTop;
    });
    interface MenuItem {
        id: string;
        name: string;
    }
    const showList = computed(() => {
        return data.articleInfoList.slice(data.start, data.end);
    });
    const selectedKeys = ref<Array<string>>(['0']);
    const orderSelectedKeys = ref<Array<string>>(['synthesis']);
    const menu = ref<Array<MenuItem>>([]);
    const getArticle = async () => {
        data.loading = true;
        const res: ArticleResultModel = await getArticleAll({
            category: selectedKeys.value[0] === '0' ? '' : selectedKeys.value[0],
            page: data.page,
            pageSize: data.pageSize,
            ordering: orderSelectedKeys.value[0],
        });
        // // 防抖处理，防止数据加载过快，骨架一闪而过影响效果
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                data.loading = false;
                resolve('');
            }, 500);
        });
        promise.then(() => {
            data.articleInfoList = res.items;
            data.next = res.next ? true : false;
        });
    };
    const handleOrder: MenuProps['onClick'] = (menuInfo) => {
        orderSelectedKeys.value[0] = menuInfo.key as string;
        console.log(orderSelectedKeys.value);
        getArticle();
    };
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
            scrollBar.value.style.height =
                data.itemHeight * data.articleInfoList.length + 64 + 20 + 'px';
            //开始的数组索引
            let first = Math.floor(scrollTop / data.itemHeight) - 1;
            data.start = first < 0 ? 0 : first;
            //结束索引
            data.end = data.start + data.showNum;
            //计算上滚动区域的高度
            list.value.style.marginTop = data.start * data.itemHeight + 'px';
        }
    }
    watch(
        () => selectedKeys.value,
        () => {
            getArticle();
        },
        { immediate: true },
    );
    function handleDelete(index: number) {
        data.articleInfoList.splice(data.start + index, 1);
    }
    onMounted(async () => {
        window.addEventListener('scroll', lasyLoading, true);
        const res = (await getArticleCategory({})).items;
        menu.value = res;
        menu.value.unshift({ id: '0', name: '全部' });
    });
    onUnmounted(() => {
        window.removeEventListener('scroll', lasyLoading);
    });
</script>
<style lang="less" scoped>
    .container.index-container {
        max-width: 1200px;
        margin: 0 auto;

        main.container {
            max-width: 1200px;
        }
    }

    .left {
        width: 180px;
        height: fit-content;
        // top: 0px;
        max-height: calc(100vh - 40px);
        overflow-x: hidden;
        border-radius: 4px;
        position: sticky;
        margin-right: 20px;
    }

    .main-container {
        margin: 0 auto;
    }

    .right {
        position: absolute;
        width: 13rem;
        right: 0px;
        top: 0px;
        height: fit-content;
        border: none;

        .content {
            position: fixed;
            border-radius: 4px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.5);
            box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
            transition: all 0.3s ease-in-out;
            width: 13rem;
        }
    }

    .content {
        background-color: #fff;
        position: relative;
        margin-right: 15rem;
        width: 720px;
        border-radius: 4px;

        .sub-type-box {
            border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
            margin-left: auto;

            .ant-menu {
                border: none;

                :deep(&:not(.ant-menu-dark)) {
                    > .ant-menu-item {
                        color: #72777b;

                        &:not(:nth-last-child(2))::after {
                            content: '';
                            position: absolute;
                            top: 50%;
                            left: 100%;
                            margin-top: -0.5em;
                            width: 1px;
                            height: 17px;
                            background-color: #b2bac2;
                            opacity: 0.5;
                            // border-bottom: none;
                            right: initial;
                        }

                        &:hover::after,
                        &::after {
                            border: none;
                        }

                        &-selected {
                            color: #000;
                        }
                    }
                }
            }
        }
    }
    @media (max-width: 600px) {
        .container.index-container {
            max-width: 100vw;
        }
    }

    @media (max-width: 1220px) {
        .index-container main.container {
            max-width: 1000px;
        }

        .left {
            display: none;
        }
    }
    @media (max-width: 1000px) {
        .content {
            margin: 0 auto;
            width: 95vw;
        }

        .right {
            display: none;
        }
    }
    @media (max-width: 600px) {
        .container.index-container {
            max-width: 100vw;
        }

        .index-container main.container {
            max-width: 100vw;
        }

        .content {
            margin-right: 0;
            max-width: 100vw;
            width: auto;
        }
    }
</style>
