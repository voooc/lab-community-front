<template>
    <div class="advertisement">
        <div class="meta-container">
            <router-link
                :to="{ name: 'user-center', params: { id: props.source.author.id } }"
                class="user-message"
                >{{ props.source.author.username }}</router-link
            >
            <div class="date">
                <Time :value="props.source.add_time" />
            </div>
            <div class="tag_list">
                <template v-for="tag in props.source.tags" :key="tag.id">
                    <router-link
                        :to="{ name: 'article-item', params: { id: props.source.id } }"
                        class="tag"
                        >{{ tag.name }}</router-link
                    >
                </template>
            </div>
        </div>
        <div class="content-wrapper">
            <div class="content-main">
                <div class="info-box">
                    <div class="title-row">
                        <router-link
                            :to="{
                                name: 'article-item',
                                params: { id: props.source.id },
                            }"
                            class="item-title"
                            >{{ props.source.title }}</router-link
                        >
                    </div>
                    <div class="abstract">
                        <router-link
                            :to="{
                                name: 'article-item',
                                params: { id: props.source.id },
                            }"
                            >{{ props.source.desc }}</router-link
                        >
                    </div>
                    <ul class="action-list">
                        <li class="item view">
                            <eye-outlined />
                            <span class="ml-4px">{{ props.source.view }}</span>
                        </li>
                        <li
                            class="item like"
                            :class="isCurrentMessageLiked ? 'active' : ''"
                            @click="handleLike"
                        >
                            <like-outlined />
                            <span class="ml-4px">{{
                                data.messageLikeNum > 0 ? data.messageLikeNum : '赞'
                            }}</span>
                        </li>
                        <li class="item comment" @click="goComment">
                            <message-outlined />
                            <span class="ml-4px">{{
                                data.messageCommentNum === 0 ? '评论' : data.messageCommentNum
                            }}</span>
                        </li>
                        <a-dropdown
                            class="item comment"
                            v-if="userInfo.id === props.source.author.id"
                        >
                            <a class="ant-dropdown-link" @click.prevent>
                                <EllipsisOutlined />
                            </a>
                            <template #overlay>
                                <a-menu @click="onClick">
                                    <a-menu-item key="edit">编辑</a-menu-item>
                                    <a-menu-item key="delete">删除</a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </ul>
                </div>
            </div>
            <img :src="props.source.avatar" class="thumb lazy" alt="封面图" />
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { Time } from '@/components/Time';
    import { computed, reactive, ref, watch } from 'vue';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import { useRouter } from 'vue-router';
    import {
        EllipsisOutlined,
        EyeOutlined,
        LikeOutlined,
        MessageOutlined,
    } from '@ant-design/icons-vue';
    import { ArticleItem } from '@/models/article';
    import { LoginStateEnum, useLoginState } from '@/views/sys/login/useLogin';
    import { postLike, deleteArticle } from '@/api/article';
    import { useAnchorStoreWithOut } from '@/store/modules/anchor';
    import { MenuProps } from 'ant-design-vue';
    const props = defineProps({
        source: {
            type: Object as PropType<ArticleItem>,
            default: () => {},
        },
        index: {
            type: Number,
            required: true,
        },
    });
    const isCurrentMessageLiked = ref(false);
    const data = reactive({
        messageLikeNum: 0,
        messageCommentNum: 0,
    });
    watch(
        () => props.source,
        (newValue) => {
            if (!newValue) return;
            isCurrentMessageLiked.value = newValue.user_interface.is_like as boolean;
            data.messageLikeNum = newValue.like as number;
            data.messageCommentNum = newValue.comment as number;
        },
        { immediate: true },
    );
    const userStore = useUserStoreWithOut();
    const anchorStore = useAnchorStoreWithOut();
    const goComment = () => {
        anchorStore.scroll = true;
        router.push({ name: 'article-item', params: { id: props.source.id } });
    };
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
    const { setLoginState } = useLoginState();
    const handleLike = async () => {
        if (!userInfo.value.username && !userInfo.value.id) {
            setLoginState(LoginStateEnum.LOGIN);
            router.push('/login');
            return;
        }
        const star = isCurrentMessageLiked.value ? -1 : 1;
        const res: any = await postLike({
            type: 'article',
            id: props.source?.id,
            star: star,
        });
        isCurrentMessageLiked.value = res.status;
        data.messageLikeNum += star;
    };
    const emit = defineEmits(['delete']);
    const router = useRouter();
    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (key == 'edit') {
            router.push({ path: `/editor/${props.source.id}` });
        } else if (key == 'delete') {
            deleteArticle(props.source.id);
            emit('delete', props.index);
        }
    };
</script>
<style lang="less" scoped>
    .advertisement {
        cursor: pointer;
        padding: 12px 20px 0;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
    }

    .meta-container {
        display: flex;
        align-items: center;
        color: #8a919f;

        .user-message {
            display: flex;
            align-items: center;
            margin-right: 12px;
            max-width: 162px;
            font-size: 13px;
            line-height: 22px;
            color: #515767;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
        }

        .date {
            padding: 0 12px;
            line-height: 22px;
            font-size: 13px;
            flex-shrink: 0;
            position: relative;

            &::before,
            &::after {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                display: block;
                width: 1px;
                height: 12px;
                content: ' ';
                background-color: #e5e6eb;
            }

            &::before {
                left: 1px;
            }

            &::after {
                right: 0px;
            }
        }

        .tag_list {
            display: flex;
            align-items: center;

            .tag {
                position: relative;
                flex-shrink: 0;
                font-size: 13px;
                line-height: 22px;
                padding: 0 8px;
                color: #8a919f;
                display: flex;
                align-items: center;

                &:not(:last-child)::after {
                    position: absolute;
                    right: -1px;
                    display: block;
                    content: ' ';
                    width: 2px;
                    height: 2px;
                    border-radius: 50%;
                    background-color: #515767;
                }
            }
        }
    }

    .content-wrapper {
        display: flex;
        padding-bottom: 12px;
        margin-top: 10px;
        width: 100%;
        border-bottom: 1px solid #e5e6eb;

        .content-main {
            flex: 1 1 auto;

            .title-row {
                display: flex;
                margin-bottom: 8px;

                .item-title {
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 24px;
                    color: var(--juejin-font-1);
                    width: 100%;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                }
            }

            .abstract {
                margin-bottom: 8px;

                a {
                    color: #8a919f;
                    font-size: 13px;
                    line-height: 22px;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                }
            }

            .action-list {
                display: flex;
                align-items: center;
                margin-bottom: 0px;

                .item {
                    position: relative;
                    margin-right: 20px;
                    font-size: 13px;
                    line-height: 20px;
                    color: #8a919f;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;

                    &.like.active {
                        color: #1e80ff;
                    }
                }
            }
        }

        .thumb {
            flex: 0 0 auto;
            width: 120px;
            height: 80px;
            margin-left: 24px;
            background-color: #fff;
            border-radius: 4px;

            &.lazy {
                position: relative;
                object-fit: cover;
            }
        }
    }
</style>
