<template>
    <div class="concern-list-box" style="background-color: #fff">
        <div class="sub-header">
            <div class="sub-header-title">关注</div>
            <div class="sub-type-box">
                <a-menu v-model:selectedKeys="data.selectedKeys" mode="horizontal">
                    <a-menu-item key="follow">关注</a-menu-item>
                    <a-menu-item key="fan">粉丝</a-menu-item>
                </a-menu>
            </div>
        </div>
        <div>
            <ul class="list tag-list" v-if="data[`${data.selectedKeys[0]}`].length">
                <template v-for="(item, index) in data[`${data.selectedKeys[0]}`]" :key="item.id">
                    <li class="item">
                        <div class="user">
                            <div class="link">
                                <router-link
                                    :to="{
                                        name: 'user-center',
                                        params: { id: item[`${data.selectedKeys[0]}`]['id'] },
                                    }"
                                    class="username"
                                    ><img
                                        class="avatar"
                                        :src="item[`${data.selectedKeys[0]}`]['image']"
                                /></router-link>
                                <div class="info-box">
                                    <router-link
                                        :to="{
                                            name: 'user-center',
                                            params: { id: item[`${data.selectedKeys[0]}`]['id'] },
                                        }"
                                        class="username"
                                        ><span class="name">{{
                                            item[`${data.selectedKeys[0]}`]['username']
                                        }}</span></router-link
                                    >
                                    <div class="detail">{{
                                        item[`${data.selectedKeys[0]}`]['desc']
                                    }}</div>
                                </div>
                                <a-button
                                    :class="item['user_interface']['is_follow'] ? 'active' : ''"
                                    class="follow-btn"
                                    v-if="userInfo.id != item[`${data.selectedKeys[0]}`]['id']"
                                    @click="
                                        handleFollow(
                                            item['user_interface']['is_follow']
                                                ? 'unfollow'
                                                : 'follow',
                                            item[`${data.selectedKeys[0]}`]['id'],
                                            index,
                                        )
                                    "
                                    >{{
                                        item['user_interface']['is_follow'] ? '已关注' : '关注'
                                    }}</a-button
                                >
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
            <a-empty v-else />
        </div>
    </div>
</template>
<script setup lang="ts">
    import { reactive } from 'vue';
    import { onMounted, ref, computed, watch } from 'vue';
    import { useEventListener } from '@/hooks/event/useEventListener';
    import { isFunction } from '@/utils/is';
    import { getUserFollow, postUserFollow } from '@/api/sys/user';
    import { useRouter } from 'vue-router';
    import { FollowResultModel } from '@/api/sys/model/userModel';
    import { FollowItem } from '@/models/user/user';
    import { useUserStoreWithOut } from '@/store/modules/user';
    const router = useRouter();
    const id = router.currentRoute.value.params.id;
    const loading = ref(false);
    interface DataModel {
        follow: Array<FollowItem>;
        fan: Array<FollowItem>;
        selectedKeys: string[];
        fanNext: boolean;
        followNext: boolean;
        fanPage: number;
        followPage: number;
    }
    const data = reactive<DataModel>({
        selectedKeys: ['follow'],
        fan: [],
        follow: [],
        fanNext: true,
        followNext: true,
        fanPage: 0,
        followPage: 0,
    });
    const userStore = useUserStoreWithOut();
    const userInfo = computed(() => {
        const {
            username = '',
            image,
            id,
        } = userStore.getUserInfo || {
            username: null,
            image: null,
            id: null,
        };
        return { username, image, id };
    });
    const handleFollow = async (type: string, id: string, num: number) => {
        const res = await postUserFollow({ follow: id, type: type });
        data[data.selectedKeys[0]][num]['user_interface']['is_follow'] = res.follow_active;
    };
    const params = computed(() => {
        return data.selectedKeys[0] === 'follow' ? { follow: id } : { fan: id };
    });
    watch(
        () => params.value,
        () => {
            data.fan = [];
            data.follow = [];
            data.fanNext = true;
            data.followNext = true;
            data.fanPage = 0;
            data.followPage = 0;
            fetchData();
        },
        { immediate: true },
    );
    async function fetchData() {
        if (data[`${data.selectedKeys[0]}Next`]) {
            loading.value = true;
            data[`${data.selectedKeys[0]}Page`] += 1;
            const res: FollowResultModel = await getUserFollow({
                page: data[`${data.selectedKeys[0]}Page`],
                pageSize: 20,
                ...params.value,
            });
            await data[`${data.selectedKeys[0]}`].push(...res.items);
            data[`${data.selectedKeys[0]}Next`] = res.next ? true : false;
            loading.value = false;
        }
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

    .tag-list {
        width: 100%;
        background-color: #fff;
        position: relative;

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
        }
    }
</style>
