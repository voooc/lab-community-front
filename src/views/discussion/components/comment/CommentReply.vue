<template>
    <div class="comment-reply-wrapper">
        <!--头像-->
        <a-avatar
            :size="40"
            class="avatar !mr-16px"
            v-if="props.replyData.user.image"
            :src="props.replyData.user.image"
        />
        <!--内容部分-->
        <div class="content">
            <!--评论用户信息-->
            <div class="comment-user-info">
                <span class="username">{{ props.replyData.user.username }}</span>
                <span class="usergroup">{{ props.replyData.user.department }}</span>
            </div>
            <!--评论文本内容-->
            <div class="comment-text">
                回复<span class="reply-to-user">{{ props.replyData.reply_to?.username }}: </span>
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span class="comment-text-inner" v-html="props.replyData.content"></span>
            </div>
            <!--图片部分-->
            <span
                class="comment-img"
                v-if="props.replyData.image.length > 0"
                @mouseleave="showImageBox(false)"
                @mouseenter="showImageBox(true)"
            >
                [图片]
                <comment-brief-image-viewer
                    :img-src="props.replyData.image[0]"
                    @show="handleShowImageBox"
                    v-show="data.isShowImageBox"
                />
                <!--大图展示组件-->
                <transition name="fade">
                    <comment-image-viewer
                        v-show="data.isShowDetailImage"
                        @close="hideDetailImage"
                        :img-src="props.replyData.image[0]"
                    />
                </transition>
            </span>
            <!--底部操作栏-->
            <div class="bottom-bar">
                <div class="left">
                    <Time :value="props.replyData.created" class="time" />
                    <span class="dot delete" v-if="userInfo.id === props.replyData.user.id">·</span>
                    <span
                        class="delete"
                        v-if="userInfo.id === props.replyData.user.id"
                        @click="handleDelete"
                    >
                        删除
                    </span>
                </div>
                <div class="right">
                    <div class="like-action" @click="toggleLikes">
                        <Icon
                            icon="bx:like"
                            :class="[isCurrentCommentLiked ? 'icon-like-fill active' : 'icon-like']"
                            class="h-full flex items-center justify-center icon"
                            style="font-size: 18px; line-height: 100%"
                        />
                        <span class="action-text" :class="{ active: isCurrentCommentLiked }">
                            {{ data.replyLikeNum > 0 ? data.replyLikeNum : '赞' }}
                        </span>
                    </div>
                    <div class="comment-action" @click="toggleCommentReplyBox">
                        <Icon
                            icon="mdi:comment-processing-outline"
                            class="h-full flex items-center justify-center icon"
                            style="font-size: 18px; line-height: 100%"
                        />
                        <span style="margin-left: 5px">回复</span>
                    </div>
                </div>
            </div>
            <!--输入框部分-->
            <div class="reply-input" v-show="data.isShowReplyInput">
                <editBox
                    v-click-outside="hideEditBox"
                    ref="replyBox"
                    @submit="handleSubmit"
                    edit-box-min-height="15px"
                    placeholder="输入回复~"
                    input-id="commentReplyInput"
                    :hide-action="false"
                    panel-bg-color="#fff"
                    bg-color-blur="#fff"
                    submit-button-text="回复"
                    :is-submitting="data.isSubmittingReply"
                    :maxImageNum="1"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { CommentItem } from '@/models/article';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import { computed, h, reactive, ref, watch, nextTick } from 'vue';
    import CommentBriefImageViewer from './CommentBriefImageViewer.vue';
    import CommentImageViewer from './CommentImageViewer.vue';
    import { Time } from '@/components/Time';
    import { Icon } from '@/components/Icon';
    import editBox from '../editBox.vue';
    import { deleteComment, postLike } from '@/api/article';
    import { useLoginState, LoginStateEnum } from '@/views/sys/login/useLogin';
    import { useRouter } from 'vue-router';
    import { useMessage } from '@/hooks/useMessage';
    import emitter from '../../index';
    const props = defineProps({
        replyData: {
            type: Object as PropType<CommentItem>,
            default: () => {},
        },
        index: {
            type: Number,
        },
        // 新鲜事id
        messageId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
        },
    });
    const data = reactive({
        //是否显示输入框
        isShowReplyInput: false,
        //是否正在回复中
        isSubmittingReply: false,
        //是否显示图片框
        isShowImageBox: false,
        //是否显示大图
        isShowDetailImage: false,
        //是否正在点赞中
        isFetchingLikes: false,
        //回复赞数
        replyLikeNum: 0,
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
    const isCurrentCommentLiked = ref(false);
    watch(
        () => props.replyData,
        (newValue) => {
            // 在数据获取之后给其他内容赋值
            if (!newValue) return;
            isCurrentCommentLiked.value = newValue.user_interface.is_like as boolean;
            data.replyLikeNum = newValue.like;
        },
        { immediate: true },
    );
    //点击其他地方隐藏回复框
    function hideEditBox() {
        data.isShowReplyInput = false;
    }
    //处理显图片框与否
    function showImageBox(isShow) {
        data.isShowImageBox = isShow;
    }
    //图片大图显示
    function handleShowImageBox() {
        data.isShowDetailImage = true;
    }
    //隐藏大图显示
    function hideDetailImage() {
        data.isShowDetailImage = false;
    }
    const replyBox = ref();
    // 是否显示评论回复框
    function toggleCommentReplyBox() {
        data.isShowReplyInput = !data.isShowReplyInput;
        nextTick(() => {
            if (data.isShowReplyInput) {
                replyBox.value && replyBox.value.focusInput();
            }
        });
    }
    const emit = defineEmits(['submit']);
    // 处理回复提交
    function handleSubmit(imgList, content) {
        data.isSubmittingReply = true;
        emit('submit', imgList, content, props.replyData.id, props.index);
    }
    const { setLoginState } = useLoginState();
    const router = useRouter();
    async function toggleLikes() {
        if (data.isFetchingLikes) return;
        data.isFetchingLikes = true;
        if (!userInfo.value.id) {
            setLoginState(LoginStateEnum.LOGIN);
            router.push('/login');
            return;
        }
        const star = isCurrentCommentLiked.value ? -1 : 1;
        const res: any = await postLike({
            type: 'comment',
            id: props.replyData.id,
            star: star,
        });
        isCurrentCommentLiked.value = res.status;
        data.replyLikeNum += star;
        data.isFetchingLikes = false;
    }
    const { createConfirm } = useMessage();
    function handleDelete() {
        if (!userInfo.value.id) {
            setLoginState(LoginStateEnum.LOGIN);
            router.push('/login');
            return;
        }
        createConfirm({
            iconType: 'warning',
            title: () => h('span', '温馨提醒'),
            content: () => h('span', '是否删除该评论'),
            onOk: async () => {
                const res = await deleteComment(props.replyData.id, {
                    type: props.type,
                    object_id: props.messageId,
                });
                emitter.emit('reFetchReplies');
                emitter.emit('updateMessageCommentNum', res.count);
            },
        });
    }
    function reset() {
        data.isShowReplyInput = false;
        data.isSubmittingReply = false;
        replyBox.value.resetAfterSubmit();
    }
    defineExpose({ reset });
</script>

<style scoped lang="less">
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .comment-reply-wrapper {
        display: flex;
        background-color: #fafbfc;
        padding: 10px 10px 0 10px;
        max-width: 100%;

        &:not(:last-child) .content {
            border-bottom: 1px solid #f1f1f1;
        }

        .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #cbcbcb;
            background-position: 50%;
            background-size: cover;
            background-repeat: no-repeat;
            margin-right: 10px;
        }

        .content {
            flex: 1;
            word-break: break-all;

            .time {
                cursor: default;
            }

            .delete {
                display: none;
            }

            &:hover .delete {
                display: inline-block;
                cursor: pointer;
            }

            .comment-user-info {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                word-break: break-all;
                /*让行高等于文字高度，使得文字上下无间隙*/
                line-height: 13px;

                .username {
                    color: #333;
                    font-size: 13px;
                    margin-right: 5px;
                }

                .usergroup {
                    color: #8a9aa9;
                    font-size: 13px;
                }
            }

            .comment-text {
                margin-top: 6px;
                color: #505050;
                line-height: 22px;
                font-size: 13px;
                word-break: break-all;
                display: inline-block;

                .comment-text-inner {
                    white-space: pre-wrap;
                    word-break: break-all;
                }

                .reply-to-user {
                    color: #406599;
                    cursor: pointer;
                }
            }

            .comment-img {
                color: #406599;
                cursor: pointer;
                margin: 0 5px;
                font-size: 13px;
                position: relative;
                display: inline-block;
            }

            .bottom-bar {
                margin-top: 7px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                padding-bottom: 10px;

                .left {
                    color: #8a9aa9;

                    .dot {
                        margin: 0 2px;
                    }
                }

                .right {
                    color: #8a9aa9;
                    display: flex;
                    justify-content: space-between;
                    min-width: 100px;

                    .comment-action {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        user-select: none;

                        &:hover {
                            color: #a3b3c2;
                        }
                    }

                    .active {
                        color: #1e80ff;
                    }

                    .like-action {
                        cursor: pointer;

                        &:hover {
                            color: #a3b3c2;
                        }

                        .action-text {
                            margin-left: 1px;
                            position: relative;
                            top: -1px;
                        }
                    }
                }
            }

            .reply-input {
                padding: 10px;
                box-sizing: border-box;
                background-color: #fff;
                border: 1px solid #f1f1f2;
                border-radius: 3px;
                word-break: break-all;
                margin-bottom: 10px;
            }
        }
    }
</style>
