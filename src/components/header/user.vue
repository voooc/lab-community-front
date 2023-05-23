<template>
    <div class="flex items-center">
        <a-dropdown-button>
            创作者中心
            <template #overlay>
                <a-menu @click="handleMenuClick">
                    <a-menu-item v-for="item in ArticleMenu" :key="item.key">
                        {{ item.value }}
                    </a-menu-item>
                </a-menu>
            </template>
            <template #icon>
                <DownOutlined />
            </template>
        </a-dropdown-button>
        <a-dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
            <span :class="[prefixCls, `${prefixCls}--light`]" class="flex m-10px">
                <a-badge :count="message.total">
                    <bell-outlined :style="{ fontSize: '16px' }" />
                </a-badge>
            </span>
            <template #overlay>
                <a-menu @click="handleNotificationClick">
                    <a-menu-item v-for="item in MessageMenu" :key="item.key">
                        <div class="relative flex w-124px items-center">
                            <span>{{ item.value }}</span>
                            <div
                                class="item-count absolute py-2px px-6px text-12px"
                                v-if="message[item.key] !== 0"
                                style="
                                    color: #fff;
                                    background-color: #f64242;
                                    border-radius: 50px;
                                    right: 0;
                                "
                                >{{ message[item.key] }}</div
                            >
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-dropdown
            placement="bottomLeft"
            :overlayClassName="`${prefixCls}-dropdown-overlay`"
            v-if="userInfo.image && userInfo.username"
        >
            <span :class="[prefixCls, `${prefixCls}--light`]" class="flex">
                <a-avatar shape="circle" :src="userInfo.image" />
            </span>
            <template #overlay>
                <div>
                    <a-card>
                        <template #title>
                            <div class="flex justify-between items-center">
                                <a-avatar shape="circle" :src="userInfo.image" />
                                <div class="info ml-10px mr-40px">{{ userInfo.username }}</div>
                            </div>
                            <ul class="fan mt-15px ml-10px flex justify-between">
                                <li class="text-center h-30px leading-30px">
                                    <router-link
                                        :to="{
                                            path: `/user/${userInfo.id}/follow`,
                                        }"
                                    >
                                        <div class="item-count font-medium mb-4px text-black">{{
                                            userInfo.follow
                                        }}</div>
                                        <div class="item-name font-normal text-xs text-gray-500"
                                            >关注</div
                                        >
                                    </router-link>
                                </li>
                                <li class="text-center h-30px leading-30px">
                                    <router-link
                                        :to="{
                                            path: `/user/${userInfo.id}/follow`,
                                        }"
                                    >
                                        <div class="item-count font-medium mb-4px text-black">{{
                                            userInfo.fan
                                        }}</div>
                                        <div class="item-name font-normal text-xs text-gray-500"
                                            >粉丝</div
                                        >
                                    </router-link>
                                </li>
                            </ul>
                        </template>
                        <template #actions>
                            <div @click="handleLogout" style="font-size: 12px; color: #8a919f"
                                ><PoweroffOutlined /> 退出登录</div
                            >
                        </template>
                        <a-menu
                            @click="handleMenuClick"
                            :get-popup-container="getPopupContainer"
                            class="!border-none"
                        >
                            <a-menu-item
                                v-for="item in CenterMenu"
                                :key="item.key"
                                style="
                                    padding: 0px 15px 0 25px;
                                    border-right: none;
                                    margin-bottom: 7px;
                                "
                                :style="{ marginTop: item.key === 'user' ? '5px' : '0px' }"
                            >
                                {{ item.value }}
                            </a-menu-item>
                        </a-menu>
                    </a-card>
                </div>
            </template>
        </a-dropdown>
    </div>
</template>
<script lang="ts" setup>
    import { PoweroffOutlined, DownOutlined } from '@ant-design/icons-vue';
    import { computed, onMounted, reactive } from 'vue';
    import { getPopupContainer } from '@/utils';
    import { BellOutlined } from '@ant-design/icons-vue';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import { useDesign } from '@/hooks/web/useDesign';
    import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
    import { useRouter } from 'vue-router';
    import { HeaderEnum, NotificationEnum } from '@/enums/header';
    import { getUserUnreadMessage } from '@/api/notification';
    const { prefixCls } = useDesign('header-user-dropdown');
    const message = reactive({
        system: 0,
        like: 0,
        comment: 0,
        follow: 0,
        total: 0,
    });
    const userStore = useUserStoreWithOut();
    const userInfo = computed(() => {
        const {
            username = '',
            image,
            id,
            fan,
            follow,
        } = userStore.getUserInfo || {
            username: null,
            image: null,
            id: null,
            fan: null,
            follow: null,
        };
        return { username, image, id, fan, follow };
    });
    interface MenuItem {
        key: string;
        value: string;
    }
    const ArticleMenu: Array<MenuItem> = [
        {
            key: HeaderEnum.WRITE_ARTICLE,
            value: '写文章',
        },
    ];
    const CenterMenu: Array<MenuItem> = [
        {
            key: HeaderEnum.USER_MAIN,
            value: '我的主页',
        },
    ];
    const MessageMenu: Array<MenuItem> = [
        {
            key: NotificationEnum.SYSTEM,
            value: '系统通知',
        },
        {
            key: NotificationEnum.LIKE,
            value: '赞',
        },
        {
            key: NotificationEnum.COMMENT,
            value: '评论',
        },
        {
            key: NotificationEnum.FOLLOW,
            value: '新增粉丝',
        },
    ];
    function handleLoginOut() {
        userStore.confirmLoginOut();
    }
    const router = useRouter();
    function handleLogout() {
        handleLoginOut();
    }
    function handleMenuClick(e: MenuInfo) {
        switch (e.key as HeaderEnum) {
            case HeaderEnum.WRITE_ARTICLE:
                router.push({ path: '/editor/new' });
                break;
            case HeaderEnum.USER_MAIN:
                router.push({ name: 'user-center', params: { id: userInfo.value.id } });
                break;
            default:
                break;
        }
    }
    function handleNotificationClick(e: MenuInfo) {
        switch (e.key as NotificationEnum) {
            case NotificationEnum.SYSTEM:
                router.push({ path: '/notification/system' });
                break;
            case NotificationEnum.COMMENT:
                router.push({ path: '/notification/comment' });
                break;
            case NotificationEnum.FOLLOW:
                router.push({ path: '/notification/follow' });
                break;
            case NotificationEnum.LIKE:
                router.push({ path: '/notification/like' });
                break;
            default:
                break;
        }
    }
    // const state = reactive({
    //     server: 'ws://127.0.0.1:8000/msg',
    //     sendValue: '',
    //     recordList: [] as { id: number; time: number; res: string }[],
    //     token: getToken() as string,
    // });
    // const { data } = useWebSocket(state.server, {
    //     autoReconnect: false,
    //     heartbeat: {
    //         message: 'ping',
    //         interval: 1,
    //     },
    //     protocols: [`${state.token}`],
    // });
    // watchEffect(() => {
    //     if (data.value) {
    //         try {
    //             const res = JSON.parse(data.value);
    //             state.recordList.push(res);
    //         } catch (error) {
    //             state.recordList.push({
    //                 res: data.value,
    //                 id: Math.ceil(Math.random() * 1000),
    //                 time: new Date().getTime(),
    //             });
    //         }
    //     }
    // });
    onMounted(async () => {
        const res = await getUserUnreadMessage();
        message.system = res.system;
        message.like = res.like;
        message.comment = res.comment;
        message.follow = res.follow;
        message.total = message.comment + message.like + message.system + message.follow;
    });
</script>

<style lang="less" scoped>
    @prefix-cls: ~'@{namespace}-header-user-dropdown';

    .@{prefix-cls} {
        height: @header-height;
        padding: 0 0 0 10px;
        padding-right: 10px;
        overflow: hidden;
        font-size: 12px;
        cursor: pointer;
        align-items: center;

        img {
            width: 100%;
            height: 100%;
            margin-right: 12px;
        }

        &__header {
            border-radius: 50%;
        }

        &__name {
            font-size: 14px;
        }

        &--light {
            .@{prefix-cls}__name {
                color: @text-color-base;
            }

            .@{prefix-cls}__desc {
                color: @header-light-desc-color;
            }
        }

        &-dropdown-overlay {
            .ant-dropdown-menu-item {
                min-width: 160px;
            }
        }
    }
</style>
<style lang="less">
    .ant-dropdown {
        .ant-card {
            &-head {
                border-bottom: none;
            }

            &-body {
                border-top: 1px solid #f0f0f0;
                padding: 0px;
            }
        }
    }
</style>
