<template>
    <div class="concern-list-box" style="background-color: #fff">
        <div class="sub-header">
            <div class="sub-header-title">赞</div>
            <div class="sub-type-box">
                <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal">
                    <a-menu-item key="article">文章</a-menu-item>
                    <a-menu-item key="discussion">动态</a-menu-item>
                </a-menu>
            </div>
        </div>
        <div class="entry-list list entry-list">
            <Skeleton :loading="loading">
                <ul
                    class="article__list"
                    ref="list"
                    v-if="article.length && selectedKeys[0] === 'article'"
                >
                    <li v-for="temp in article" :key="temp.id" class="item h-139px">
                        <Item :source="temp.item" />
                    </li>
                </ul>
                <template v-if="discussion.length && selectedKeys[0] === 'discussion'">
                    <message
                        v-for="temp in discussion"
                        :key="temp.id"
                        v-model:comment-num="temp.item.comment"
                        :message-info="temp.item"
                    />
                </template>
                <a-empty v-if="!article.length && !discussion.length" />
            </Skeleton>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import Item from '@/views/article/list.vue';
    import Message from '@/views/discussion/components/Message.vue';
    import { onMounted, ref, computed, watch, reactive } from 'vue';
    import { useEventListener } from '@/hooks/event/useEventListener';
    import { isFunction } from '@/utils/is';
    import { getUserLike } from '@/api/sys/user';
    import { Skeleton } from 'ant-design-vue';
    import { useRouter } from 'vue-router';
    import { LikeItem, LikeResultModel } from '@/models/user/user';
    const router = useRouter();
    const id = computed(() => {
        return router.currentRoute.value.params.id;
    });
    const loading = ref(false);
    const data = reactive({
        discussionNext: true,
        articleNext: true,
        discussionPage: 0,
        articlePage: 0,
    });
    const article = ref<Array<LikeItem>>([]);
    const discussion = ref<Array<LikeItem>>([]);
    const selectedKeys = ref<string[]>(['article']);
    async function fetchData() {
        if (data[`${selectedKeys.value[0]}Next`]) {
            loading.value = true;
            data[`${selectedKeys.value[0]}Page`] += 1;
            const res: LikeResultModel = await getUserLike({
                user: id.value,
                page: data[`${selectedKeys.value[0]}Page`],
                pageSize: 20,
                type: selectedKeys.value[0],
            });
            if (selectedKeys.value[0] === 'article') {
                article.value.push(...res.items);
            } else {
                discussion.value.push(...res.items);
            }
            data[`${selectedKeys.value[0]}Next`] = res.next ? true : false;
            loading.value = false;
        }
    }
    watch(
        () => selectedKeys.value[0],
        () => {
            article.value = [];
            discussion.value = [];
            data.discussionNext = true;
            data.articleNext = true;
            data.discussionPage = 0;
            data.articlePage = 0;
            fetchData();
        },
        { immediate: true },
    );
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

            .ant-menu {
                border: none;

                :deep(&:not(.ant-menu-dark)) {
                    > .ant-menu-item {
                        color: #72777b;

                        &:not(:nth-last-child(2))::after {
                            content: '';
                            position: absolute;
                            top: 50%;
                            left: 67px;
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
</style>
