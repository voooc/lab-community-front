<template>
    <div class="post-list-box" style="background-color: #fff">
        <div class="sub-header">
            <div class="sub-header-title">文章</div>
        </div>
        <div class="list entry-list">
            <template v-if="data.length">
                <li v-for="(item, index) in data" class="item" :key="item.id">
                    <Item :source="item" :index="index" @delete="handleDelete" />
                </li>
            </template>
            <a-empty v-else />
        </div>
    </div>
</template>
<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import Item from '@/views/article/list.vue';
    import { useEventListener } from '@/hooks/event/useEventListener';
    import { isFunction } from '@/utils/is';
    import { getArticleAll } from '@/api/article/index';
    import { useRouter } from 'vue-router';
    import { ArticleItem, ArticleResultModel } from '@/models/article';
    const router = useRouter();
    const id = router.currentRoute.value.params.id;
    const loading = ref(false);
    const next = ref(true);
    const page = ref(1);
    const data = ref<Array<ArticleItem>>([]);
    async function fetchData() {
        if (next.value) {
            loading.value = true;
            const res: ArticleResultModel = await getArticleAll({
                user: id,
                page: page.value,
                pageSize: 20,
            });
            data.value.push(...res.items);
            next.value = res.next ? true : false;
            loading.value = false;
        }
    }
    function handleDelete(index: number) {
        data.value.splice(index, 1);
    }
    function scrollFn() {
        if (!fetchData || !isFunction(fetchData)) return;
        //获取网页的总高度
        const htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        //clientHeight是网页在浏览器中的可视高度
        const clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        //scrollTop是浏览器滚动条的top位置
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        //判断到底部了,为了避免一些问题，设置距离底部50px时就执行代码
        if (scrollTop + clientHeight > htmlHeight - 50) {
            fetchData();
        }
    }
    onMounted(async () => {
        useEventListener({
            el: window,
            name: 'scroll',
            listener: scrollFn,
            wait: 100,
        });
        fetchData();
    });
</script>
<style lang="less" scoped>
    .sub-header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 2rem;
        height: 3rem;
        white-space: nowrap;
        border-bottom: 2px solid rgba(230, 230, 231, 0.5);

        &-title {
            margin-right: 12px;
            font-size: 16px;
            font-weight: 600;
            color: #000;
        }

        .sub-type-box {
            margin-left: auto;
        }
    }

    .entry-list {
        width: 100%;
        background-color: #fff;
        position: relative;

        .item {
            list-style-type: none;
        }
    }
</style>
