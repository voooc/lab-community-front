<template>
    <PageWrapper>
        <div class="pt-20px flex relative page-wrapper container index-container">
            <div class="container main-container">
                <a-list item-layout="horizontal" :data-source="data">
                    <template #renderItem="{ item }">
                        <a-badge :dot="!item.has_read" class="!flex flex-col !mb-16px" size="large">
                            <a-list-item style="background: #fff" class="!p-12px">
                                <template #actions>
                                    <template v-if="item.dst_info['id_type'] === 'article'">
                                        <router-link
                                            :to="{
                                                name: 'article-item',
                                                params: { id: item.object_id },
                                            }"
                                            class="item-title"
                                        >
                                            <img
                                                :src="item.dst_info.image"
                                                class="w-120px h-80px"
                                                style="object-fit: fill"
                                            />
                                        </router-link>
                                    </template>
                                </template>
                                <Skeleton avatar :title="false" :loading="!!item.loading" active>
                                    <a-list-item-meta>
                                        <template #title>
                                            <router-link
                                                :to="{
                                                    name: 'user-center',
                                                    params: {
                                                        id: item.to_user.id,
                                                    },
                                                }"
                                                class="username"
                                                >{{ item.to_user.username }}</router-link
                                            >
                                            <span
                                                class="ml-8px"
                                                style="
                                                    color: #8a919f;
                                                    font-weight: 400;
                                                    font-size: 15px;
                                                "
                                            >
                                                <template
                                                    v-if="item.dst_info['id_type'] === 'article'"
                                                >
                                                    评论了你的文章
                                                    <router-link
                                                        :to="{
                                                            name: 'article-item',
                                                            params: { id: item.object_id },
                                                        }"
                                                        class="item-title ml-5px"
                                                        >&laquo;{{
                                                            item.dst_info.title
                                                        }}&raquo;</router-link
                                                    >
                                                </template>
                                                <template
                                                    v-if="item.dst_info['id_type'] === 'discussion'"
                                                >
                                                    评论了你的动态
                                                    <router-link
                                                        :to="{
                                                            name: 'discussion-item',
                                                            params: { id: item.object_id },
                                                        }"
                                                        class="item-title ml-5px"
                                                        >"{{ item.dst_info.detail }}"</router-link
                                                    >
                                                </template>
                                                <template
                                                    v-if="item.dst_info['id_type'] === 'comment'"
                                                >
                                                    {{
                                                        item.parent_info['id_type'] === 'discussion'
                                                            ? '回复了你在动态'
                                                            : '回复了你在文章'
                                                    }}
                                                    <router-link
                                                        :to="{
                                                            name:
                                                                item.parent_info['id_type'] ===
                                                                'discussion'
                                                                    ? 'discussion-item'
                                                                    : 'article-item',
                                                            params: {
                                                                id: item.parent_info.item_id,
                                                            },
                                                        }"
                                                        class="item-title ml-5px"
                                                        >"{{
                                                            item.parent_info.detail
                                                        }}"</router-link
                                                    >
                                                    下的评论
                                                </template>
                                            </span>
                                        </template>
                                        <template #avatar>
                                            <a-avatar :src="item.to_user.image" size="small" />
                                        </template>
                                        <template #description>
                                            <div
                                                v-if="item.dst_info.detail"
                                                class="mb-10px p-10px"
                                                style="
                                                    font-size: 14px;
                                                    border: 1px solid #f1f1f2;
                                                    white-space: pre-wrap;
                                                    line-height: 20px;
                                                    background-color: #fafbfc;
                                                    border-radius: 4px;
                                                "
                                            >
                                                {{ item.dst_info.detail }}
                                            </div>
                                            <Time :value="item.add_time" />
                                        </template>
                                    </a-list-item-meta>
                                </Skeleton>
                            </a-list-item>
                        </a-badge>
                    </template>
                </a-list>
            </div>
        </div>
    </PageWrapper>
</template>
<script lang="ts" setup>
    import { onMounted, ref, onUnmounted } from 'vue';
    import { Time } from '@/components/Time';
    import { Skeleton } from 'ant-design-vue';
    import { PageWrapper } from '@/components/Page';
    import { getUserSystemMessage, delectAllUserSystemMessage } from '@/api/notification/index';
    import { useEventListener } from '@/hooks/event/useEventListener';
    import { isFunction } from '@/utils/is';
    const data = ref<Array<any>>([]);
    const loading = ref(false);
    const page = ref(0);
    const next = ref(true);
    async function fetchData() {
        loading.value = true;
        page.value += 1;
        const res = await getUserSystemMessage({
            type: 'comment',
            page: page.value,
            pageSize: 20,
        });
        data.value.push(...res.items);
        const ids = [];
        data.value.forEach((item) => {
            if (!item.has_read) {
                // @ts-ignore
                ids.push(item.id);
            }
        });
        if (ids.length) {
            await delectAllUserSystemMessage({ ids: ids });
        }
        next.value = res.next ? true : false;
        loading.value = false;
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
            if (next.value) fetchData();
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
    onUnmounted(() => {
        window.removeEventListener('scroll', scrollFn);
    });
</script>
<style lang="less" scoped>
    .ant-badge {
        display: block;
        margin: 4px;
        background-color: #fff;

        :deep(.ant-badge-dot) {
            width: 8px;
            height: 8px;
            min-width: 8px;
        }
    }
</style>
