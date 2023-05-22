<template>
    <PageWrapper>
        <div class="pt-20px flex relative page-wrapper container index-container">
            <div class="container main-container">
                <a-list item-layout="horizontal" :data-source="data">
                    <template #renderItem="{ item, index }">
                        <a-badge :dot="!item.has_read" class="!flex flex-col !mb-16px" size="large">
                            <a-list-item style="background: #fff" class="!p-12px item">
                                <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                                    <div class="user">
                                        <div class="link">
                                            <router-link
                                                :to="{
                                                    name: 'user-center',
                                                    params: {
                                                        id: item.to_user.id,
                                                    },
                                                }"
                                                class="username"
                                                ><img class="avatar" :src="item.to_user.image"
                                            /></router-link>
                                            <div class="info-box">
                                                <router-link
                                                    :to="{
                                                        name: 'user-center',
                                                        params: {
                                                            id: item.to_user.id,
                                                        },
                                                    }"
                                                    class="username"
                                                    ><span class="name">{{
                                                        item.to_user.username
                                                    }}</span></router-link
                                                >
                                                <span class="ml-5px" style="color: #8a919f">{{
                                                    item.message
                                                }}</span>
                                                <div class="detail">
                                                    <Time :value="item.add_time" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="operate-btn">
                                        <a-button
                                            :class="
                                                item['user_interface']['is_follow'] ? 'active' : ''
                                            "
                                            class="follow-btn"
                                            @click="
                                                handleFollow(
                                                    item['user_interface']['is_follow']
                                                        ? 'unfollow'
                                                        : 'follow',
                                                    item.to_user.id,
                                                    index,
                                                )
                                            "
                                            >{{
                                                item['user_interface']['is_follow']
                                                    ? '已关注'
                                                    : '关注'
                                            }}</a-button
                                        >
                                    </div>
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
    import { Time } from '@/components/Time';
    import { getUserSystemMessage, delectAllUserSystemMessage } from '@/api/notification/index';
    import { useEventListener } from '@/hooks/event/useEventListener';
    import { isFunction } from '@/utils/is';
    import { MessageResultModel, MessageItem } from '@/models/user/user';
    import { postUserFollow } from '@/api/sys/user';
    const data = ref<Array<MessageItem>>([]);
    const loading = ref(false);
    const page = ref(1);
    const next = ref(true);
    const handleFollow = async (type: string, id: string, num: number) => {
        const res = await postUserFollow({ follow: id, type: type });
        data.value[num]['user_interface']['is_follow'] = res.follow_active;
        console.log(data);
    };
    async function fetchData() {
        loading.value = true;
        const res: MessageResultModel = await getUserSystemMessage({
            type: 'follow',
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

    .item {
        list-style-type: none;

        &:not(:last-child) {
            border-bottom: 1px solid rgba(230, 230, 231, 0.5);
        }

        .user {
            position: relative;

            .link {
                cursor: pointer;
                display: flex;
                align-items: center;
                min-height: 84px;
                padding: 6px 28px;

                .avatar {
                    flex: 0 0 auto;
                    margin-right: 20px;
                    width: 44px;
                    border-radius: 50%;
                    display: inline-block;
                    position: relative;
                    background-position: 50%;
                    background-size: cover;
                    background-repeat: no-repeat;
                    object-fit: cover;
                }

                .info-box {
                    flex: 1 1 auto;
                    min-width: 0;

                    .username {
                        font-size: 16px;
                        font-weight: 600;
                        color: #2e3155;

                        .name {
                            max-width: 128px;
                            display: inline-block;
                            vertical-align: top;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }

                    .detail {
                        margin-top: 8px;
                        font-size: 12px;
                        font-weight: 500;
                        color: #b9c0c8;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }

                .follow-btn {
                    flex: 0 0 auto;
                    margin: 0 0 0 12px;
                    font-size: 12px;
                    background-color: #fff;
                    border-radius: 4px;
                    border: 1px solid #92c452;
                    color: #92c452;

                    &.active {
                        background-color: #92c452;
                        color: #fff;
                    }
                }
            }
        }

        .follow-btn {
            flex: 0 0 auto;
            margin: 0 0 0 12px;
            font-size: 12px;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #92c452;
            color: #92c452;

            &.active {
                background-color: #92c452;
                color: #fff;
            }
        }
    }
</style>
