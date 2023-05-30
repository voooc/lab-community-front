<!--新鲜事评论模块,包含输入框和一级评论模块-->
<template>
    <div class="message-comment-wrapper">
        <!--顶部三角形-->
        <div class="top-triangle"> </div>
        <!--输入框部分-->
        <div class="message-comment-reply-input-wrapper relative">
            <div class="login-guide" v-if="!props.username">
                <div class="login-guide-text">看完啦，</div>
                <div class="login-guide-button" @click="goLogin">登录</div>
                <div class="login-guide-text">分享一下感受吧～</div>
            </div>
            <template v-else>
                <!--头像-->
                <a-avatar
                    :size="40"
                    class="avatar !mr-16px"
                    v-if="props.commentAvatar"
                    :src="props.commentAvatar"
                />
                <a-avatar :size="40" class="avatar" v-else>
                    <template #icon><UserOutlined /></template>
                </a-avatar>
                <!--输入框-->
                <div class="input">
                    <MessageEditBox
                        ref="commentBox"
                        @submit="handleSubmit"
                        edit-box-min-height="15px"
                        placeholder="输入评论~"
                        input-id="messageCommentInput"
                        :hide-action="true"
                        panel-bg-color="#fafbfc"
                        bg-color-blur="#fff"
                        submit-button-text="评论"
                        :is-submitting="data.isSubmittingComment"
                        :maxImageNum="1"
                    />
                </div>
            </template>
        </div>
        <!--一级评论展示列表-->
        <div class="comment-list" v-if="commentList.length > 0">
            <primary-comment-list
                v-for="item in commentList"
                :key="item.id"
                v-model:likes="item.like"
                :message-id="props.messageId"
                :comment-data="item"
                :type="props.type"
            />
        </div>
        <!--查看更多按钮-->
        <div class="show-more-comment" @click="showMoreComment" v-if="data.isShowLoadMoreComment">
            查看更多 >
        </div>
    </div>
</template>

<script setup lang="ts">
    import PrimaryCommentList from './PrimaryCommentList.vue';
    import { onMounted, reactive, ref, watch } from 'vue';
    import MessageEditBox from '../editBox.vue';
    import { UserOutlined } from '@ant-design/icons-vue';
    import { LoginStateEnum, useLoginState } from '@/views/sys/login/useLogin';
    import { uploadApi } from '@/api/sys/upload';
    import { getComment, postComment } from '@/api/article';
    import { useRouter } from 'vue-router';
    import { CommentItem } from '@/models/article';
    import { BasicFetchResult } from '@/models/base';
    import emitter from '../../index';
    const props = defineProps({
        messageId: {
            type: String,
            default: '',
        },
        commentAvatar: {
            type: String,
        },
        username: {
            type: String,
        },
        type: {
            type: String,
        },
    });
    const { setLoginState } = useLoginState();
    const router = useRouter();
    function goLogin() {
        setLoginState(LoginStateEnum.LOGIN);
        router.push('/login');
    }
    const commentBox = ref();
    const commentList = ref<CommentItem[]>([]);
    const data = reactive({
        //是否在提交评论中
        isSubmittingComment: false,
        //一次最多加载的评论条数
        pageSize: 6,
        //当前已加载的页数(每页maxCommentLoadNumEachTime条)
        page: 1,
        //是否显示加载更多按钮
        isShowLoadMoreComment: false,
        //是否正在获取评论
        isFetchingComment: false,
    });
    async function showMoreComment() {
        if (data.isShowLoadMoreComment) return;
        data.page = data.page + 1;
        await fetchComments(true);
    }
    async function fetchComments(isAppend) {
        data.isFetchingComment = true;
        const res: BasicFetchResult<CommentItem> = await getComment({
            object_id: props.messageId,
            type: props.type,
            parent: null,
            page: data.page,
            pageSize: data.pageSize,
        });
        if (isAppend) {
            commentList.value = commentList.value.concat(res.items);
        } else {
            commentList.value = res.items;
        }
        data.isShowLoadMoreComment = res.next ? true : false;
        data.isFetchingComment = false;
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
    watch(
        () => props.messageId,
        (newValue) => {
            if (newValue) {
                fetchComments(false);
            }
        },
        { immediate: true },
    );
    const emit = defineEmits(['modify-comment-num']);
    async function handleSubmit(imageList, text) {
        data.isSubmittingComment = true;
        const imgUrlList = await uploadImg(imageList);
        const res = await postComment({
            content: text,
            object_id: props.messageId,
            parent_comment_id: null,
            type: props.type,
            image: imgUrlList.join(';'),
        });
        data.isSubmittingComment = false;
        commentBox.value.resetAfterSubmit();
        //重置页数为1
        data.page = 1;
        //修改父组件上的评论数
        emit('modify-comment-num', res.count);
        //刷新评论列表
        await fetchComments(false);
    }
    onMounted(() => {
        emitter.on('reFetchComments', async () => {
            data.page = 1;
            await fetchComments(false);
        });
    });
</script>

<style scoped lang="less">
    .message-comment-wrapper {
        position: relative;
        border-top: 1px solid #ebebeb;
        background-color: #fff;
        padding-bottom: 20px;

        .top-triangle {
            position: absolute;
            left: 50%;
            top: -6px;
            width: 10px;
            height: 10px;
            transform: translateX(-50%) rotate(45deg);
            border-left: 1px solid #ebebeb;
            border-top: 1px solid #ebebeb;
            background-color: #fff;
        }

        .message-comment-reply-input-wrapper {
            background-color: #fafbfc;
            margin: 16px 20px;
            display: flex;
            border-radius: 3px;
            padding: 12px 15px;

            .login-guide {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0px;
                left: 0px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                color: #252933;
                font-size: 15px;
                font-weight: 400;

                &-button {
                    color: #1e80ff;
                    font-weight: 500;
                    cursor: pointer;
                    margin: 0 4px;
                }
            }

            .avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 12px;
                background-position: 50%;
                background-size: cover;
                background-repeat: no-repeat;
            }

            .input {
                flex: 1;
                /*必须加，否则不换行*/
                word-break: break-all;
            }
        }

        .comment-list {
            margin: 10px 20px 10px 80px;
        }

        .show-more-comment {
            height: 45px;
            line-height: 45px;
            border-top: 1px solid #ebebeb;
            color: #406599;
            cursor: pointer;
            font-size: 13px;
            text-align: center;
            user-select: none;
        }
    }
</style>
