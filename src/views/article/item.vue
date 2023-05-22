<template>
    <PageWrapper v-if="data.info">
        <div class="article-container container">
            <div class="main-area article-area">
                <article class="article">
                    <h1 class="article-title">{{ data.info.title }}</h1>
                    <div class="author-info-block">
                        <router-link
                            :to="{ name: 'user-center', params: { id: data.info.author.id } }"
                        >
                            <a-avatar
                                :src="data.info.author.image"
                                class="!mr-12px"
                                alt="封面图"
                                :size="40"
                            />
                        </router-link>
                        <div class="author-info-box">
                            <div class="author-name">
                                <router-link
                                    :to="{
                                        name: 'user-center',
                                        params: { id: data.info.author.id },
                                    }"
                                >
                                    <span class="name">{{ data.info.author.username }}</span>
                                </router-link>
                            </div>
                            <div class="meta-box">
                                <time :datetime="data.info.add_time" class="time">{{
                                    data.info.add_time
                                }}</time>
                                <span class="views-count"> · 阅读{{ data.info.view }} </span>
                                <router-link
                                    class="edit-btn"
                                    style="margin-left: 6px"
                                    v-if="userInfo.id && data.info.author.id"
                                    :to="{
                                        path: `/editor/${data.info.id}`,
                                    }"
                                    >编辑</router-link
                                >
                            </div>
                        </div>
                    </div>
                    <img :src="data.info.avatar" class="thumb" alt="封面图" />
                    <div class="article-content">
                        <MdEditor
                            ref="markDownRef"
                            placeholder="请输入"
                            :content="data.info.content"
                            :code="data.info.code_highlight"
                            :preview="data.info.preview"
                            previewOnly
                            showCodeRowNumber
                            editorId="article-item"
                        />
                    </div>
                </article>
                <div class="article-end">
                    <div class="tag-list-box">
                        <div class="tag-list">
                            <div class="tag-list-title">分类：</div>
                            <router-link
                                :to="{
                                    name: 'article-item',
                                    params: { id: data.info.id },
                                }"
                                class="item category-item"
                            >
                                <span>{{ data.info.category.name }}</span>
                            </router-link>
                        </div>
                        <div class="tag-list">
                            <div class="tag-list-title">标签： </div>
                            <div class="tag-list-container">
                                <template v-for="item in data.info.tags" :key="item.id">
                                    <router-link
                                        :to="{
                                            name: 'article-item',
                                            params: { id: data.info.id },
                                        }"
                                        class="item tag-item"
                                    >
                                        <span class="tag-title">{{ item.name }}</span>
                                    </router-link>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="comment-container">
                    <div class="comment-form">
                        <div class="header">
                            <span class="header-title">评论</span>
                        </div>
                        <div class="content">
                            <a-avatar
                                :size="40"
                                class="avatar-box !mr-16px"
                                v-if="userInfo.username && userInfo.image"
                                :src="userInfo.image"
                            />
                            <a-avatar :size="40" class="avatar-box" v-else>
                                <template #icon><UserOutlined /></template>
                            </a-avatar>
                            <div class="form-box">
                                <div class="auth-card">
                                    <div class="input-box">
                                        <div class="login-guide" v-if="!userInfo.username">
                                            <div class="login-guide-text">看完啦，</div>
                                            <div class="login-guide-button" @click="goLogin"
                                                >登录</div
                                            >
                                            <div class="login-guide-text">分享一下感受吧～</div>
                                        </div>
                                        <template v-else>
                                            <!--输入框-->
                                            <div class="input">
                                                <MessageEditBox
                                                    ref="commentBox"
                                                    @submit="handleSubmit"
                                                    edit-box-min-height="75px"
                                                    placeholder="输入评论~"
                                                    input-id="messageCommentInput"
                                                    :hide-action="false"
                                                    submit-button-text="评论"
                                                    :is-submitting="data.isSubmittingComment"
                                                    :maxImageNum="1"
                                                />
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="comment-list-wrapper" id="comment">
                        <div class="title">全部评论{{ commentList.length }}</div>
                        <div class="comment-list comment-list">
                            <div class="comment" v-if="commentList.length > 0">
                                <primary-comment-list
                                    v-for="item in commentList"
                                    :key="item.id"
                                    v-model:likes="item.like"
                                    :message-id="data.info.id"
                                    :comment-data="item"
                                    type="article"
                                />
                            </div>
                            <div
                                class="show-more-comment"
                                @click="showMoreComment"
                                v-if="data.isShowLoadMoreComment"
                            >
                                查看更多 >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sidebar">
                <a-card class="sidebar-block author-block">
                    <router-link
                        :to="{ name: 'user-center', params: { id: data.info.author.id } }"
                        class="user-item item"
                    >
                        <a-avatar :src="data.info.author.image" alt="封面图" :size="47" />
                        <div class="info-box max-w-128px ml-15px">
                            <span class="username">{{ data.info.author.username }}</span>
                            <div class="desc">{{ data.info.author.desc }}</div>
                        </div>
                    </router-link>
                    <div class="operate-btn" v-if="userInfo.username">
                        <a-button
                            type="primary"
                            class="w-100px"
                            :class="follow_active ? 'active' : ''"
                            v-if="userInfo.username != data.info.author.username"
                            @click="handleFollow(follow_active ? 'unfollow' : 'follow')"
                            >{{ follow_active ? '已关注' : '关注' }}</a-button
                        >
                    </div>
                    <div class="cut-off"></div>
                    <div class="stat-item item">
                        <like-two-tone class="mr-12px" style="font-size: 16px" />
                        <span class="content">
                            获得点赞
                            <span class="count">{{ data.info.like }}</span>
                        </span>
                    </div>
                    <div class="stat-item item">
                        <eye-two-tone class="mr-12px" style="font-size: 16px" />
                        <span class="content">
                            文章被阅读
                            <span class="count">{{
                                parseInt(data.info.view).toLocaleString()
                            }}</span>
                        </span>
                    </div>
                </a-card>
                <a-card title="相关文章" class="sidebar-block related-entry-sidebar-block shadow">
                    <template v-for="temp in article" :key="temp.id">
                        <router-link
                            :to="{
                                name: 'article-item',
                                params: { id: data.info.id },
                            }"
                            class="entry-list item"
                        >
                            <div>
                                <div class="entry-title">{{ temp.title }}</div>
                                <div class="entry-meta-box">
                                    <div class="entry-meta">点赞{{ temp.like }}</div>
                                    <div class="entry-meta mx-2px"> · </div>
                                    <div class="entry-meta">评论{{ temp.comment }}</div>
                                </div>
                            </div>
                        </router-link>
                    </template>
                </a-card>
                <a-card
                    title="目录"
                    class="sidebar-block !sticky sidebar-block-catalog"
                    :style="{ top: `calc(20px + ${leftTop})` }"
                >
                    <MdCatalog editorId="article-item" class="catalog" />
                </a-card>
            </div>
            <div class="article-suspended-panel dynamic-data-ready">
                <div
                    class="panel-btn with-badge"
                    :badge="`${data.messageLikeNum}`"
                    :class="data.info.user_interface.is_like ? 'active' : ''"
                    @click="handleLike"
                >
                    <Icon
                        icon="bx:like"
                        class="h-full flex items-center justify-center icon"
                        style="font-size: 29px; line-height: 100%"
                    />
                </div>
                <div
                    @click="anchorStore.scroll = true"
                    class="panel-btn with-badge"
                    :badge="`${data.messageCommentNum}`"
                >
                    <Icon
                        icon="mdi:comment-processing-outline"
                        class="h-full flex items-center justify-center icon"
                        style="font-size: 27px; line-height: 100%; color: black"
                    />
                </div>
            </div>
        </div>
    </PageWrapper>
</template>
<script lang="ts" setup>
    import { Icon } from '@/components/Icon';
    import PrimaryCommentList from '@/views/discussion/components/comment/PrimaryCommentList.vue';
    import MessageEditBox from '@/views/discussion/components/editBox.vue';
    import { PageWrapper } from '@/components/Page';
    import { EyeTwoTone, LikeTwoTone } from '@ant-design/icons-vue';
    import { useRouter } from 'vue-router';
    import { onMounted, reactive, ref, computed, watch, nextTick } from 'vue';
    import { MdEditor, MdCatalog } from '@/components/Markdown';
    import {
        getArticleDetail,
        getArticleAll,
        postLike,
        getComment,
        postComment,
    } from '@/api/article/index';
    import { ArticleResultModel, ArticleItem, TagItem, CommentItem } from '@/models/article';
    import { useHeaderSecondMenuStore } from '@/store/modules/headerMenu';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import { LoginStateEnum, useLoginState } from '@/views/sys/login/useLogin';
    import { useAnchorStoreWithOut } from '@/store/modules/anchor';
    import { postUserFollow } from '@/api/sys/user';
    import { uploadApi } from '@/api/sys/upload';
    import { BasicFetchResult } from '@/models/base';
    import emitter from '../discussion';
    const secondMenuStore = useHeaderSecondMenuStore();
    const userStore = useUserStoreWithOut();
    const router = useRouter();
    const id = router.currentRoute.value.params.id;
    const { setLoginState } = useLoginState();
    const anchorStore = useAnchorStoreWithOut();
    watch(
        () => anchorStore.scroll,
        () => {
            anchorStore.scroll &&
                (document.querySelector(anchorStore.scroll) as Element) &&
                nextTick(() => {
                    anchorStore.goAnchor();
                });
        },
        { immediate: true },
    );
    const follow_active = ref<boolean>(false);
    const handleFollow = async (type: string) => {
        const res = await postUserFollow({ follow: data.info?.author.id, type: type });
        follow_active.value = res.follow_active;
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
    const leftTop = computed(() => {
        return secondMenuStore.marginTop;
    });
    const markDownRef = ref();
    interface DataModel {
        info: Nullable<ArticleItem>;
        messageLikeNum: number;
        messageCommentNum: number;
        //是否在提交评论中
        isSubmittingComment: boolean;
        //一次最多加载的评论条数
        pageSize: number;
        //当前已加载的页数(每页maxCommentLoadNumEachTime条)
        page: number;
        //是否显示加载更多按钮
        isShowLoadMoreComment: boolean;
        //是否正在获取评论
        isFetchingComment: boolean;
    }
    const data = reactive<DataModel>({
        info: null,
        messageLikeNum: 0,
        messageCommentNum: 0,
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
    function showMoreComment() {
        if (data.isShowLoadMoreComment) return;
        data.page = data.page + 1;
        fetchComments(true);
    }
    const article = ref<Array<ArticleItem>>([]);
    const isCurrentMessageLiked = ref(false);
    async function handleLike() {
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
    function goLogin() {
        setLoginState(LoginStateEnum.LOGIN);
        router.push('/login');
    }
    const commentBox = ref();
    const commentList = ref<CommentItem[]>([]);
    async function fetchComments(isAppend) {
        data.isFetchingComment = true;
        const res: BasicFetchResult<CommentItem> = await getComment({
            object_id: data.info?.id,
            type: 'article',
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
    async function handleSubmit(imageList, text) {
        data.isSubmittingComment = true;
        const imgUrlList = await uploadImg(imageList);
        const res = await postComment({
            content: text,
            object_id: data.info?.id,
            parent_comment_id: null,
            type: 'article',
            image: imgUrlList.join(';'),
        });
        data.isSubmittingComment = false;
        commentBox.value.resetAfterSubmit();
        //重置页数为1
        data.page = 1;
        //修改父组件上的评论数
        data.messageCommentNum = res.count;
        //刷新评论列表
        await fetchComments(false);
    }
    onMounted(async () => {
        const res = await getArticleDetail(id);
        const res2: ArticleResultModel = await getArticleAll({
            category: res.category.id,
            tag: res.tags.map((item: TagItem) => item.id),
        });
        data.info = res;
        if (data.info) {
            follow_active.value = data.info.user_interface.is_follow;
            isCurrentMessageLiked.value = data.info.user_interface.is_like as boolean;
            data.messageLikeNum = data.info.like as number;
            data.messageCommentNum = data.info.comment as number;
        }
        article.value = res2.items;
        await fetchComments(false);
        emitter.on('reFetchComments', async () => {
            data.page = 1;
            await fetchComments(false);
        });
        emitter.on('updateMessageCommentNum', (number) => {
            data.messageCommentNum = number;
        });
    });
</script>
<style lang="less" scoped>
    .main-area {
        position: relative;
        max-width: 100%;
        width: 820px;

        .article {
            background-color: #fff;
            padding: 20px 12px;
            border-radius: 4px 4px 0 0;

            &-title {
                font-weight: 600;
                margin: 0 0 1rem;
                font-size: 1rem;
                color: #252933;
            }

            .author-info {
                &-block {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                &-box {
                    min-width: 0;
                    flex-grow: 1;
                    min-height: 43px;

                    .author-name {
                        height: 1.5rem;
                        display: flex;
                        align-items: center;

                        .name {
                            max-width: 128px;
                        }
                    }

                    .meta-box {
                        font-size: 14px;
                        color: #8a919f;
                        margin-top: 2px;
                        line-height: 22px;

                        time {
                            letter-spacing: 1px;
                        }

                        .edit-btn {
                            color: #1e80ff;
                            cursor: pointer;
                        }
                    }
                }
            }

            .thumb {
                width: 100%;
                object-fit: cover;
                position: relative;
                max-height: 400px;
            }
        }

        .article-end {
            background-color: #fff;
            padding: 10px 32px 30px 32px;
            border-radius: 0 0 4px 4px;

            .tag-list-box {
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;
                margin-bottom: -12px;

                .tag-list {
                    display: flex;
                    line-height: 30px;

                    &:not(&:last-child) {
                        margin-right: 2rem;
                        flex-shrink: 0;
                    }

                    &-title {
                        flex-shrink: 0;
                        margin-right: 8px;
                        font-size: 14px;
                        color: #515767;
                    }

                    .item {
                        display: flex;
                        align-items: center;
                        padding: 0 12px;
                        border-radius: 4px;
                        margin: 0 8px 12px 0;
                        transition: background-color 0.15s linear;

                        &.category-item {
                            background-color: #f2f3f5;
                            color: #515767;
                            line-height: 32px;

                            &:hover {
                                background-color: #e4e6eb;
                            }
                        }
                    }

                    &-container {
                        display: flex;
                        flex-wrap: wrap;

                        .tag-item {
                            background-color: #eaf2ff;
                            color: #1e80ff;
                            line-height: 32px;

                            &:hover {
                                background-color: rgba(30, 128, 255, 0.16);
                            }

                            .tag-title {
                                white-space: nowrap;
                                // line-height: 32px;
                            }
                        }
                    }
                }
            }
        }

        .comment-container {
            border-radius: 4px;
            background-color: #fff;
            padding: 0 32px 24px;
            margin-top: 20px;

            .comment-form {
                display: flex;
                position: relative;
                padding-top: 24px;
                border-radius: 2px;
                flex-direction: column;

                .header {
                    margin-bottom: 24px;

                    &-title {
                        font-size: 18px;
                        line-height: 30px;
                        font-weight: 600;
                        color: #252933;
                    }
                }

                .content {
                    display: flex;
                    align-items: flex-start;

                    .form-box {
                        position: relative;
                        flex: 1 1 auto;

                        .auth-card {
                            .input-box {
                                transition: all 0.3s;
                                border-radius: 4px;
                                position: relative;

                                textarea {
                                    background: #f2f3f5;
                                    border-radius: 4px;
                                    border: 1px solid #f2f3f5;

                                    &:focus {
                                        background-color: #fff;
                                        border-top: transparent;
                                    }
                                }

                                .login-guide {
                                    width: 100%;
                                    height: 100%;
                                    background-color: #f2f3f5;
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
                            }
                        }

                        .action-box {
                            margin-top: 8px;

                            .submit {
                                text-align: right;
                            }
                        }
                    }
                }
            }

            .comment-list-wrapper {
                padding-top: 32px;

                .title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #252933;
                    border: none;
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

            .operate-btn {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
                justify-content: flex-start;

                .active {
                    background-color: #92c452;
                    border: none;
                    color: #fff;
                }
            }

            .user-item {
                padding-bottom: 1rem;

                .info-box {
                    .username {
                        font-weight: 500;
                        color: #252933;
                        font-size: 16px;
                    }

                    .desc {
                        margin-top: 4px;
                        font-weight: 400;
                        color: #515767;
                        line-height: 22px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 14px;
                    }
                }
            }

            .cut-off {
                height: 0.5px;
                background-color: #e4e6eb;
            }

            .stat-item {
                margin-top: 0.5rem;
            }

            .item {
                display: flex;
                align-items: center;
            }

            .entry-list {
                &:not(&:last-child) {
                    padding-bottom: 10px;
                }

                .entry-title {
                    line-height: 22px;
                    font-weight: 400;
                    color: #252933;
                    font-size: 14px;
                }

                .entry-meta-box {
                    margin-top: 4px;

                    .entry-meta {
                        display: inline-block;
                        font-size: 14px;
                        line-height: 22px;
                        color: #8a9a9f;
                        font-weight: 400;
                    }
                }
            }

            &-catalog {
                :deep(.ant-card-body) {
                    max-height: 350px;
                    overflow-y: auto;
                }
            }

            .catalog {
                :deep(&.md-editor-catalog) > .md-editor-catalog-link {
                    padding: 0px;
                }
            }
        }
    }

    .article-suspended-panel {
        position: fixed;
        margin-left: -4rem;
        top: 140px;
        z-index: 2;

        .panel-btn {
            position: relative;
            margin-bottom: 32px;
            width: 47px;
            height: 47px;
            background-color: #fff;
            background-position: 50%;
            background-repeat: no-repeat;
            border-radius: 50%;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
            cursor: pointer;
            text-align: center;
            font-size: 1rem;

            &.with-badge::after {
                content: attr(badge);
                position: absolute;
                top: 0;
                left: 75%;
                height: 17px;
                line-height: 17px;
                padding: 0 5px;
                border-radius: 9px;
                font-size: 11px;
                text-align: center;
                white-space: nowrap;
                background-color: #c2c8d1;
                color: #fff;
            }

            &.active {
                .icon {
                    color: #1e80ff;
                }

                &::after {
                    background-color: #1e80ff;
                }
            }
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
</style>
