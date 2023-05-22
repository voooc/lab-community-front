<!--新鲜事一级评论组件-->
<template>
    <div class="primary-comment-wrapper" v-if="props.commentData">
        <a-avatar
            :size="40"
            class="avatar !mr-16px"
            v-if="props.commentData.user.image"
            :src="props.commentData.user.image"
        />
        <!--内容部分-->
        <div class="content">
            <!--评论用户信息-->
            <div class="comment-user-info">
                <span class="username">{{ props.commentData.user.username }}</span>
                <span class="usergroup">{{ props.commentData.user.department }}</span>
            </div>
            <!--评论文本内容-->
            <!-- eslint-disable-next-line vue/no-v-html-->
            <div class="comment-text" v-html="props.commentData.content"></div>
            <!--评论图片部分-->
            <div
                class="comment-img"
                v-if="props.commentData.image.length > 0"
                @click="showDetailImage"
                :style="{ backgroundImage: 'url(' + props.commentData.image[0] + ')' }"
            >
            </div>
            <!--底部操作栏-->
            <div class="bottom-bar">
                <div class="left">
                    <Time :value="props.commentData.created" class="time" />
                    <span class="dot delete" v-if="userInfo.id === props.commentData.user.id"
                        >·</span
                    >
                    <span
                        class="delete"
                        v-if="userInfo.id === props.commentData.user.id"
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
                            {{ data.commentLikeNum > 0 ? data.commentLikeNum : '赞' }}
                        </span>
                    </div>
                    <div class="comment-action" @click="toggleCommentReplyBox">
                        <Icon
                            icon="mdi:comment-processing-outline"
                            class="h-full flex items-center justify-center icon"
                            style="font-size: 18px; line-height: 100%"
                        />
                        <span style="margin-left: 5px">{{
                            data.commentCommentNum > 0 ? data.commentCommentNum : '回复'
                        }}</span>
                    </div>
                </div>
            </div>
            <!--回复框部分-->
            <div class="comment-box-wrapper" v-if="data.isShowCommentReplyBox">
                <MessageEditBox
                    v-click-outside="hideEditBox"
                    ref="replyBox"
                    @submit="handleSubmit"
                    edit-box-min-height="15px"
                    placeholder="输入回复~"
                    input-id="messageCommentReplyInput"
                    :hide-action="false"
                    panel-bg-color="#fafbfc"
                    bg-color-blur="#fff"
                    submit-button-text="回复"
                    :is-submitting="data.isSubmittingReply"
                    :maxImageNum="1"
                />
            </div>
            <!--二级评论组件-->
            <div class="reply-wrapper" v-if="replyList.length > 0">
                <comment-reply
                    v-for="(item, index) in replyList"
                    ref="replyComp"
                    @submit="handleChildSubmitReply"
                    v-model:likes="item.like"
                    :index="index"
                    :key="item.id"
                    :reply-data="item"
                    :type="props.type"
                    :message-id="props.messageId"
                />
                <!--加载更多-->
                <div class="fetch-more" v-if="data.isShowLoadMore">
                    <span
                        class="fetch-more-text"
                        v-if="!data.isFetchingReply"
                        @click="fetchMoreReply"
                    >
                        加载更多
                    </span>
                    <span v-else> 加载中... </span>
                </div>
            </div>
        </div>
        <!--全屏大图查看组件,动画过渡效果-->
        <transition name="fade">
            <comment-image-viewer
                @close="closeViewer"
                :img-src="props.commentData.image[0]"
                v-if="data.isShowViewer"
            />
        </transition>
    </div>
</template>
<script setup lang="ts">
    import CommentImageViewer from './CommentImageViewer.vue';
    import { CommentItem } from '@/models/article';
    import CommentReply from './CommentReply.vue';
    import MessageEditBox from '../editBox.vue';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import { computed, h, onMounted, reactive, ref, watch } from 'vue';
    import { Time } from '@/components/Time';
    import { Icon } from '@/components/Icon';
    import { LoginStateEnum, useLoginState } from '@/views/sys/login/useLogin';
    import { useRouter } from 'vue-router';
    import { deleteComment, getComment, postComment, postLike } from '@/api/article';
    import { useMessage } from '@/hooks/useMessage';
    import emitter from '../../index';
    import { uploadApi } from '@/api/sys/upload';
    import { BasicFetchResult } from '@/models/base';
    const props = defineProps({
        // 评论数据对象
        commentData: {
            type: Object as PropType<CommentItem>,
            default: () => {},
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
    const replyList = ref<CommentItem[]>([]);
    const replyComp = ref();
    const data = reactive({
        //是否显示全屏查看大图组件
        isShowViewer: false,
        //是否显示评论回复框
        isShowCommentReplyBox: false,
        //是否显示加载更多
        isShowLoadMore: false,
        //是否正在提交回复
        isSubmittingReply: false,
        //是否正在获取回复
        isFetchingReply: false,
        //回复数量初始加载数量
        replyInitialShowNum: 2,
        //点击加载更多后加载的回复数量
        replyNumOfPageSize: 4,
        //回复列表显示的当前页数
        replyListCurrentPage: 1,
        //是否是首次加载回复(只加载2条)
        isFirstLoadReply: true,
        //提交回复后无加载更多下最多显示条数
        maxReplyNumShownAfterSubmit: 10,
        //二级回复组件的index
        replyComponentIndex: 0,
        //是否正在点赞中
        isFetchingLikes: false,
        commentLikeNum: 0,
        commentCommentNum: 0,
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
    // 显示大图
    function showDetailImage() {
        data.isShowViewer = true;
    }
    const isCurrentCommentLiked = ref(false);
    watch(
        () => props.commentData,
        (newValue) => {
            // 在数据获取之后给其他内容赋值
            if (!newValue) return;
            isCurrentCommentLiked.value = newValue.user_interface.is_like as boolean;
            data.commentLikeNum = newValue.like;
            data.commentCommentNum = newValue.comment;
        },
        { immediate: true },
    );
    // 关闭全屏查看组件
    function closeViewer() {
        data.isShowViewer = false;
    }
    // 隐藏输入框
    function hideEditBox() {
        data.isShowCommentReplyBox = false;
    }
    const { setLoginState } = useLoginState();
    const router = useRouter();
    const { createConfirm, createMessage } = useMessage();
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
                await deleteComment(props.commentData.id, {
                    type: props.type,
                    object_id: props.messageId,
                });
                data.commentCommentNum -= 1;
                emitter.emit('reFetchComments');
            },
        });
    }
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
            id: props.commentData.id,
            star: star,
        });
        isCurrentCommentLiked.value = res.status;
        data.commentLikeNum += star;
        data.isFetchingLikes = false;
    }
    // 是否显示评论回复框
    function toggleCommentReplyBox() {
        data.isShowCommentReplyBox = !data.isShowCommentReplyBox;
    }
    const uploadImg = async (files: Array<File>) => {
        const res = await Promise.all(
            files.map((file) => {
                return new Promise(async (rev, rej) => {
                    uploadApi({ file: file }, () => {})
                        .then((res) => rev(res))
                        .catch((error) => rej(error));
                });
            }),
        );
        return res;
    };
    const replyBox = ref();
    async function submit(temp, isReplyReply: boolean) {
        data.isSubmittingReply = true;
        const imgUrlList = await uploadImg(temp.imageList);
        const res = await postComment({
            content: temp.text,
            object_id: temp.object_id,
            parent_comment_id: temp.parent_comment_id,
            type: props.type,
            image: imgUrlList.join(';'),
        });
        data.isSubmittingReply = false;
        fetchReply(1, 10000, true);
        replyBox.value && replyBox.value.resetAfterSubmit();
        emitter.emit('updateMessageCommentNum', res.count);
        data.commentCommentNum += 1;
        createMessage.success('评论成功');
        //如果是回复的回复，则重置其输入框,此时replyComp是个数组，因为v-for
        if (isReplyReply) {
            replyComp.value[data.replyComponentIndex].reset();
        }
    }
    function handleSubmit(imageList, text) {
        const temp = {
            text: text,
            imageList: imageList,
            object_id: props.messageId,
            parent_comment_id: props.commentData.id,
        };
        submit(temp, false);
    }
    function handleChildSubmitReply(imgList, text, parent_comment_id, index) {
        const temp = {
            text: text,
            imageList: imgList,
            object_id: props.messageId,
            parent_comment_id: parent_comment_id,
        };
        data.replyComponentIndex = index;
        submit(temp, true);
    }
    // 获取评论的回复
    async function fetchReply(pageNum: number, pageSize: number, isShowAll: boolean) {
        data.isFetchingReply = true;
        const res: BasicFetchResult<CommentItem> = await getComment({
            object_id: props.messageId,
            type: props.type,
            parent: props.commentData.id,
            page: pageNum,
            pageSize: pageSize,
        });
        if (!isShowAll) {
            replyList.value = replyList.value.concat(res.items);
        } else {
            replyList.value = res.items;
        }
        data.commentCommentNum = res.items.length;
        data.isShowLoadMore = res.next ? true : false;
        data.isFirstLoadReply = false;
        data.replyListCurrentPage = data.replyListCurrentPage + 1;
        data.isFetchingReply = false;
    }
    // 首次拉取回复
    function fetchReplyFirstTime() {
        //清空相关数据结构
        data.replyListCurrentPage = 1;
        data.isFirstLoadReply = true;
        replyList.value = [];
        fetchReply(data.replyListCurrentPage, data.replyNumOfPageSize, false);
    }
    // 拉取更多回复
    function fetchMoreReply() {
        if (data.isFetchingReply) return;
        fetchReply(data.replyListCurrentPage, data.replyNumOfPageSize, false);
    }
    onMounted(() => {
        fetchReplyFirstTime();
        emitter.on('reFetchReplies', () => {
            fetchReplyFirstTime();
        });
    });
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

    .primary-comment-wrapper {
        display: flex;
        margin-top: 10px;

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

        &:not(:last-child) .divider-line {
            border-bottom: 1px solid #f1f1f1;
            margin-top: 10px;
        }

        .content {
            /*white-space: nowrap;*/
            /*overflow: hidden;*/
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
                white-space: pre-wrap;
                word-break: break-all;
            }

            .comment-img {
                margin-top: 10px;
                width: 80px;
                height: 80px;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: 50%;
                cursor: zoom-in;
                background-color: #cbcbcb;
            }

            .comment-box-wrapper {
                margin-bottom: 10px;
                box-sizing: border-box;
                padding: 12px;
                background-color: #fafbfc;
            }

            .reply-wrapper {
                word-break: break-all;
                width: 100%;
                max-width: 100%;

                .fetch-more {
                    font-size: 13px;
                    line-height: 40px;
                    text-align: center;
                    background-color: #fafbfc;

                    .fetch-more-text {
                        color: #406599;
                        cursor: pointer;
                    }
                }
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

                    .like-action {
                        cursor: pointer;

                        &:hover {
                            color: #a3b3c2;
                        }

                        .active {
                            color: #1e80ff;
                        }
                    }
                }
            }
        }
    }
</style>
