<template>
    <PageWrapper>
        <div class="user-container container">
            <div class="main-area user-area">
                <div class="header">
                    <a-card size="small" style="width: 100%">
                        <div class="flex justify-between items-center">
                            <div class="flex">
                                <a-avatar :size="64" :src="data.user?.image" />
                                <div class="ml-20px flex flex-col justify-between">
                                    <div class="username">{{ data.user?.username }}</div>
                                    <div class="text-xs text-gray-500">{{ data.user?.desc }}</div>
                                </div>
                            </div>
                            <div class="right mr-30px" v-if="userInfo.username && data.user">
                                <a-button
                                    type="primary"
                                    :class="follow_active ? 'active' : ''"
                                    @click="handleFollow(follow_active ? 'unfollow' : 'follow')"
                                    v-if="userInfo.username != data.user.username"
                                    >{{ follow_active ? '已关注' : '+关注' }}</a-button
                                >
                                <a-button type="primary" v-else @click="handleEdit"
                                    >编辑个人资料</a-button
                                >
                            </div>
                        </div>
                    </a-card>
                </div>
                <div class="list-block mt-10px">
                    <div class="detail-list">
                        <div class="list-header">
                            <a-menu
                                :selectedKeys="[
                                    $route.path.split('/')[$route.path.split('/').length - 1],
                                ]"
                                mode="horizontal"
                            >
                                <a-menu-item key="article">
                                    <RouterLink :to="{ path: `/user/${id}/article` }"
                                        >文章</RouterLink
                                    >
                                </a-menu-item>
                                <a-menu-item key="follow"
                                    ><RouterLink :to="{ path: `/user/${id}/follow` }"
                                        >关注</RouterLink
                                    ></a-menu-item
                                >
                                <a-menu-item key="like"
                                    ><RouterLink :to="{ path: `/user/${id}/like` }"
                                        >赞</RouterLink
                                    ></a-menu-item
                                >
                            </a-menu>
                        </div>
                        <div class="list-body">
                            <router-view :key="$route.fullPath" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="sidebar">
                <a-card class="sidebar-block">
                    <ul class="fan flex justify-between">
                        <li class="text-center h-30px leading-30px">
                            <a href="#">
                                <div class="item-count font-medium mb-4px text-black">{{
                                    data.user?.follow
                                }}</div>
                                <div class="item-name font-normal text-xs text-gray-500">关注</div>
                            </a>
                        </li>
                        <li class="text-center h-30px leading-30px">
                            <a href="#">
                                <div class="item-count font-medium mb-4px text-black">{{
                                    data.user?.fan
                                }}</div>
                                <div class="item-name font-normal text-xs text-gray-500">粉丝</div>
                            </a>
                        </li>
                    </ul>
                </a-card>
            </div>
        </div>
    </PageWrapper>
</template>
<script lang="ts" setup>
    import { PageWrapper } from '@/components/Page';
    import { useRouter } from 'vue-router';
    import { onMounted, reactive, computed, ref, watch } from 'vue';
    import { getSingleUser, postUserFollow } from '@/api/sys/user';
    import { UserInfo } from '@/models/user/user';
    import { useUserStoreWithOut } from '@/store/modules/user';
    const router = useRouter();
    const id = computed(() => {
        return router.currentRoute.value.params.id;
    });
    interface DataModel {
        user: Nullable<UserInfo>;
    }
    const data = reactive<DataModel>({
        user: null,
    });
    const follow_active = ref<boolean>(false);
    function handleEdit() {
        router.push({ path: '/user/settings/profile' });
    }
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
    const handleFollow = async (type: string) => {
        const res = await postUserFollow({ follow: data.user?.id, type: type });
        follow_active.value = res.follow_active;
        if (!data.user) return;
        if (follow_active.value) {
            data.user.fan += 1;
        } else {
            data.user.fan = data.user.fan - 1;
        }
    };
    watch(
        () => id.value,
        (value) => {
            if (value) getData();
        },
    );
    async function getData() {
        const res: UserInfo = await getSingleUser(id.value);
        data.user = res;
        follow_active.value = data.user?.user_interface?.is_follow as boolean;
    }
    onMounted(async () => {
        await getData();
    });
</script>
<style lang="less" scoped>
    .main-area {
        position: relative;
        max-width: 100%;
        width: 860px;

        .header {
            :deep(.ant-card) {
                .right {
                    .ant-btn.active {
                        background-color: #f2f3f5;
                        color: #8a919f;
                        border: unset;

                        span {
                            text-shadow: none;
                            font-weight: 400;
                            border: none;
                        }
                    }
                }
            }
        }

        .list-block {
            .list-header {
                position: relative;
                margin: 0;
                padding: 0;
                background-color: #fff;
                z-index: 100;

                .nav-item {
                    display: flex;
                    flex: 0 0 auto;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    width: 5rem;
                    height: 100%;
                    cursor: pointer;
                }
            }
        }
    }

    .sidebar {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        width: 18rem;

        &-block {
            background-color: #fff;
            border-radius: 4px;
            margin-bottom: 20px;
            position: relative;
        }
    }
    @media (max-width: 1140px) {
        .main-area {
            width: calc(100% - 20rem);
        }
    }
    @media (max-width: 1000px) {
        .main-area {
            width: 100%;
        }

        .sidebar {
            display: none;
        }
    }
    @media (min-width: 1600px) {
        .main-area {
            width: 1260px;
        }
    }
</style>
