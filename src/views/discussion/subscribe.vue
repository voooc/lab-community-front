<!--新鲜事动态模块-->
<template>
    <div class="container">
        <!--新鲜事为空的提示信息-->
        <div class="message-empty" v-if="messageList.length === 0 && !data.isLoading">
            <span class="empty-text">暂时没有新鲜事~快去发布吧!</span>
        </div>
        <!--loading的图就是2个骨架图-->
        <message-skeleton-loading v-if="data.isLoading" />
        <!--新鲜事组件,sync修饰符用于子组件动态修改prop的值-->
        <message
            v-for="(item, index) in messageList"
            :key="item.id"
            :message-index="index"
            @update:comment-num="updateCommentNum"
            :comment-num="commentNums[index]"
            :message-info="item"
        />
    </div>
</template>

<script lang="ts" setup>
    import { getDiscussionAll } from '@/api/article';
    import MessageSkeletonLoading from './components/MessageSkeletonLoading.vue';
    import { DiscussionResultModel, DiscussionModel } from '@/models/article';
    import { onMounted, onUnmounted, reactive, ref } from 'vue';
    import emitter from './index';
    import Message from './components/Message.vue';
    const messageList = ref<DiscussionModel[]>([]);
    const props = defineProps({
        sortBy: {
            type: String,
            default: 'time',
        },
    });
    const data = reactive({
        //是否显示骨架屏
        isShowSkeleton: false,
        //是否正在loading
        isLoading: false,
        //是否是首次记载
        isFirstLoading: true,
        //一次最多加载的新鲜事条数
        maxNumOfMessageLoad: 10,
        //加载距离(px,滚动窗口时，如果文档底部的距离距离屏幕底部的距离小于该值则进行加载)
        loadDistance: 200,
        //当前页数
        currentPage: 1,
        //是否正在加载更多数据
        isFetchingMoreMessage: false,
        //是否还有更多新鲜事
        hasMoreMessage: true,
    });
    const commentNums = ref<number[]>([]);
    function updateCommentNum(index, newCommentNum) {
        commentNums.value[index] = newCommentNum;
    }
    function scrollToFetchMoreMessages() {
        if (data.isLoading) return;
        let scrollHeight = document.body.scrollHeight;
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        let windowHeight = document.body.clientHeight || document.documentElement.clientHeight;
        let distance = data.loadDistance;
        //滚动到距离页面底部distance的距离处开始加载
        if (scrollTop + windowHeight + distance >= scrollHeight) {
            //如果在loading状态或者没有更多新鲜事了则不继续处理
            if (data.isLoading || !data.hasMoreMessage) return;
            //页数+1
            data.currentPage = data.currentPage + 1;
            fetchMessages();
        }
    }
    async function fetchMessages() {
        if (data.isLoading) return;
        //进入加载状态
        data.isLoading = true;
        //首次加载新鲜事才显示骨架屏
        if (data.isFirstLoading) {
            data.isShowSkeleton = true;
        }
        const res: DiscussionResultModel = await getDiscussionAll({
            page: data.currentPage,
            pageSize: data.maxNumOfMessageLoad,
            ordering: props.sortBy,
        });
        data.isLoading = false;
        data.isShowSkeleton = false;
        messageList.value = res.items;
        commentNums.value = messageList.value.map((item) => {
            return item.comment;
        });
        data.hasMoreMessage = res.next ? true : false;
        data.isFirstLoading = false;
    }
    onMounted(async () => {
        window.addEventListener('scroll', scrollToFetchMoreMessages);
        await fetchMessages();
        emitter.on('updateMessageList', () => {
            data.currentPage = 1;
            messageList.value = [];
            data.isFirstLoading = true;
            fetchMessages();
        });
        emitter.on('reFetchMessages', () => {
            data.currentPage = 1;
            messageList.value = [];
            data.isFirstLoading = true;
            fetchMessages();
        });
    }),
        onUnmounted(() => {
            window.removeEventListener('scroll', scrollToFetchMoreMessages);
        });
</script>

<style scoped lang="less">
    .container {
        .message-empty {
            height: 100px;
            padding: 20px;
            box-sizing: border-box;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            background-color: #fff;
            margin-bottom: 20px;
            text-align: center;
            line-height: 60px;

            .empty-text {
                color: #cbcbcb;
                font-size: 14px;
            }
        }
    }
</style>
