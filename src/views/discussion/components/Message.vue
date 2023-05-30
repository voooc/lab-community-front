<template>
    <div class="wrapper" v-if="props.messageInfo">
        <div class="header">
            <div
                class="avatar-wrapper"
                :style="{
                    backgroundImage: 'url(' + props.messageInfo.author.image + ')',
                }"
            >
            </div>
            <!--信息部分-->
            <div class="info">
                <div class="name">
                    {{ props.messageInfo.author.username }}
                </div>
                <div class="time">
                    <span>{{ props.messageInfo.author.department }}</span>
                    <span>&nbsp;·&nbsp;</span>
                    <router-link
                        :to="{
                            name: 'discussion-item',
                            params: { id: props.messageInfo.id },
                        }"
                    >
                        <Time :value="props.messageInfo.add_time" class="timestamp" />
                    </router-link>
                </div>
            </div>
            <!--更多部分-->
            <div class="more-btn">
                <a-dropdown v-if="messageCanDelelet">
                    <ellipsis-outlined />
                    <template #overlay>
                        <a-menu @click="handleClick">
                            <a-menu-item key="delete">删除 </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
        <!--中部内容部分-->
        <!-- eslint-disable-next-line vue/no-v-html-->
        <div class="content" v-html="props.messageInfo.content"></div>
        <!--中间图片部分-->
        <div class="img-wrapper">
            <!--图片展示组件-->
            <message-image-viewer
                :imageList="props.messageInfo.image"
                v-if="props.messageInfo.image.length > 0"
            />
        </div>
        <!--底部按钮部分-->
        <div class="footer">
            <!--点赞-->
            <div class="action-wrapper" @click="toggleMessageLikes(props.messageInfo.id)">
                <Icon
                    icon="bx:like"
                    :class="[isCurrentMessageLiked ? 'icon-like-fill active' : 'icon-like']"
                    class="h-full flex items-center justify-center icon"
                    style="font-size: 18px; line-height: 100%"
                />
                <span class="action-text" :class="{ active: isCurrentMessageLiked }">
                    {{ data.messageLikeNum > 0 ? data.messageLikeNum : '赞' }}
                </span>
            </div>
            <div class="action-wrapper" @click="toggleComment">
                <Icon
                    icon="mdi:comment-processing-outline"
                    class="h-full flex items-center justify-center icon"
                    style="font-size: 18px; line-height: 100%"
                />
                <span class="action-text">{{ commentNum === 0 ? '评论' : commentNum }}</span>
            </div>
        </div>
        <!--评论模块-->
        <Comment
            v-if="data.isShowComment"
            @modify-comment-num="handleModifyCommentNum"
            :message-id="props.messageInfo.id"
            :comment-avatar="userInfo.image"
            :username="userInfo.username"
            type="discussion"
            :messageIndex="props.messageIndex"
        />
    </div>
</template>
<script setup lang="ts">
    import { deleteDiscussion, postLike } from '@/api/article';
    import { Time } from '@/components/Time';
    import { useMessage } from '@/hooks/useMessage';
    import { DiscussionModel } from '@/models/article';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import { Icon } from '@/components/Icon';
    import emitter from '../index';
    import Comment from './comment/index.vue';
    import { EllipsisOutlined } from '@ant-design/icons-vue';
    import { MenuProps } from 'ant-design-vue/lib/menu';
    import { computed, h, reactive, ref, watch, onMounted } from 'vue';
    import MessageImageViewer from './MessageImageViewer.vue';
    import { LoginStateEnum, useLoginState } from '@/views/sys/login/useLogin';
    import { useRouter } from 'vue-router';
    const props = defineProps({
        messageInfo: {
            type: Object as PropType<DiscussionModel>,
        },
        commentNum: {
            type: Number,
            default: 0,
        },
    });
    const data = reactive({
        isfetchingLikes: false,
        // 内部变量，方便及时改变
        messageLikeNum: 0,
        messageCommentNum: 0,
        likedMessageList: [],
        isShowComment: false,
    });
    const emit = defineEmits(['update:commentNum']);
    function handleModifyCommentNum(number: string) {
        emit('update:commentNum', number);
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
    const messageCanDelelet = computed(() => {
        if (!props.messageInfo) return;
        return props.messageInfo.author.id === userInfo.value.id;
    });
    const isCurrentMessageLiked = ref(false);
    const commentNum = ref(0);
    watch(
        () => props.commentNum,
        (newValue) => {
            commentNum.value = newValue;
        },
        { immediate: true },
    );
    watch(
        () => props.messageInfo,
        (newValue) => {
            // 在数据获取之后给其他内容赋值
            if (!newValue) return;
            isCurrentMessageLiked.value = newValue.user_interface.is_like as boolean;
            data.messageLikeNum = newValue.like;
            data.messageCommentNum = newValue.comment;
        },
        { immediate: true },
    );
    const { setLoginState } = useLoginState();
    const router = useRouter();
    async function toggleMessageLikes(id: string) {
        if (data.isfetchingLikes) return;
        if (!userInfo.value.id) {
            setLoginState(LoginStateEnum.LOGIN);
            router.push('/login');
            return;
        }
        const star = isCurrentMessageLiked.value ? -1 : 1;
        const res: any = await postLike({
            type: 'discussion',
            id: id,
            star: star,
        });
        isCurrentMessageLiked.value = res.status;
        data.messageLikeNum += star;
    }
    function toggleComment() {
        data.isShowComment = !data.isShowComment;
    }
    const handleClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'delete') {
            const { createConfirm } = useMessage();
            createConfirm({
                iconType: 'warning',
                title: () => h('span', '温馨提醒'),
                content: () => h('span', '是否删除该动态'),
                onOk: async () => {
                    await deleteDiscussion(props.messageInfo && props.messageInfo.id);
                    emitter.emit('reFetchMessages');
                },
            });
        }
    };
    onMounted(() => {
        emitter.on('updateMessageCommentNum', handleModifyCommentNum);
    });
</script>
<style scoped lang="less">
    .wrapper {
        width: 100%;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        background-color: #fff;
        margin-bottom: 15px;

        .header {
            display: flex;
            align-items: center;
            padding: 16px 20px 0 20px;

            .avatar-wrapper {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                overflow: hidden;
                background-color: #cbcbcb;
                background-size: cover;
                background-position: 50%;
                background-repeat: no-repeat;
            }

            .info {
                margin-left: 12px;
                height: 100%;

                .name {
                    font-size: 15px;
                    color: #2e3135;
                    font-weight: 600;
                }

                .time {
                    color: #8a9aa9;
                    font-size: 13px;
                    margin-top: 10px;

                    .timestamp {
                        cursor: pointer;
                    }
                }
            }

            .more-btn {
                /*flex中最后一项右对齐，设置marginLeft为auto即可*/
                margin: 0 -1px 0 auto;

                .more-text {
                    color: #b8c1cc;
                    font-size: 30px;
                    outline: none;
                    cursor: pointer;

                    &:hover {
                        color: #999999;
                    }
                }
            }
        }

        .content {
            margin: 10px 40px 10px 78px;
            font-size: 15px;
            line-height: 1.5;
            /*关键:保留换行和空格*/
            white-space: pre-wrap;
            color: #17181a;
            word-break: break-all;
        }

        .img-wrapper {
            margin: 10px 40px 10px 78px;
        }

        .footer {
            display: flex;
            height: 34px;
            margin-top: 15px;
            position: relative;
            border-top: 1px solid #ebebeb;

            .action-wrapper {
                flex: 1;
                height: 100%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                color: #8a93a0;
                cursor: pointer;
                user-select: none;

                &:hover {
                    color: #a5afbc;
                }

                .action-text {
                    margin-left: 3px;
                }

                .active {
                    color: #1e80ff;
                }
            }
            /*除最后一个div有border*/
            .action-wrapper:not(:last-child):after {
                content: '';
                width: 1px;
                height: 24px;
                top: 50%;
                position: absolute;
                right: 0;
                transform: translateY(-50%);
                background-color: #ebebeb;
            }
        }
    }
</style>
