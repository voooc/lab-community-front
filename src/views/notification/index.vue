<template>
    <PageWrapper>
        <div class="pt-20px flex relative page-wrapper container index-container">
            <div class="container main-container">
                <a-list item-layout="horizontal" :data-source="data">
                    <template #renderItem="{ item }">
                        <a-badge :dot="!item.has_read" class="!flex flex-col !mb-16px" size="large">
                            <a-list-item style="background: #fff" class="!p-12px">
                                <template #actions>
                                    <a
                                        key="list-loadmore-edit"
                                        @click="handleRead(item)"
                                        v-if="!item.has_read"
                                        >已读</a
                                    >
                                    <a key="list-loadmore-more" @click="handleDelete(item)">删除</a>
                                </template>
                                <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                                    <a-list-item-meta :description="item.message">
                                        <template #title>
                                            <span>{{ item.to_user.username }}</span>
                                        </template>
                                        <template #avatar>
                                            <a-avatar :src="item.to_user.image" size="small" />
                                        </template>
                                    </a-list-item-meta>
                                </a-skeleton>
                            </a-list-item>
                        </a-badge>
                    </template>
                </a-list>
            </div>
        </div>
    </PageWrapper>
</template>
<script lang="ts" setup>
    import { onMounted, onUnmounted, ref } from 'vue';
    import { PageWrapper } from '@/components/Page';
    import {
        getUserSystemMessage,
        putUserSystemMessage,
        delectUserSystemMessage,
        delectAllUserSystemMessage,
    } from '@/api/notification/index';
    import { useEventListener } from '@/hooks/event/useEventListener';
    import { isFunction } from '@/utils/is';
    const props = defineProps({
        type: String,
    });
    const data = ref<Array<any>>([]);
    const handleRead = async (item) => {
        item.has_read = true;
        await putUserSystemMessage({ ...item }, item.id);
        window.location.reload();
    };
    const handleDelete = async (item) => {
        await delectUserSystemMessage(item.id);
        window.location.reload();
    };
    const loading = ref(false);
    const page = ref(1);
    const next = ref(true);
    async function fetchData() {
        loading.value = true;
        const res = await getUserSystemMessage({
            type: props.type,
            page: page.value,
            pageSize: 20,
        });
        data.value = res.items;
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
