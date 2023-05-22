<template>
    <div class="container mt-25px mx-auto relative max-w-1040px" v-if="messageList.length">
        <message
            v-model:comment-num="messageList[0].comment"
            :message-info="messageList[0]"
            class="main-content"
        />
        <div class="recommend absolute w-300px">
            <div class="item-headline">
                <span>热门推荐</span>
            </div>
            <div class="aside-new-lists" style="padding: 8px 12px 12px">
                <div
                    v-for="(item, index) in recommendMessageList"
                    :key="index"
                    class="aside-list-item"
                >
                    <router-link
                        :to="{
                            name: 'discussion-item',
                            params: { id: item.id },
                        }"
                        class="flex justify-between"
                    >
                        <div class="content-box">
                            <div class="content">
                                {{ item.content }}
                            </div>
                            <div class="stat">
                                <span>{{ item.like }} 赞 ·</span>
                                <span>{{ item.comment }} 评论 ·</span>
                            </div>
                        </div>
                        <div
                            class="image-box"
                            v-if="item.image.length"
                            :style="{ backgroundImage: 'url(' + item.image[0] + ')' }"
                        >
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { getDiscussionAll, getDiscussionDetail } from '@/api/article';
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import Message from './components/Message.vue';
    import { DiscussionModel, DiscussionResultModel } from '@/models/article';
    const router = useRouter();
    const messageList = ref<DiscussionModel[]>([]);
    const id = router.currentRoute.value.params.id;
    const recommendMessageList = ref<DiscussionModel[]>([]);
    onMounted(async () => {
        const res = await getDiscussionDetail(id);
        messageList.value[0] = res;
        const res2: DiscussionResultModel = await getDiscussionAll({
            page: 1,
            pageSize: 5,
            ordering: 'time',
        });
        recommendMessageList.value = res2.items;
    });
</script>
<style scoped lang="less">
    .main-content {
        width: 720px;
        max-width: 100%;
        border-radius: 2px;
    }

    .recommend {
        border-radius: 4px;
        top: 0px;
        right: 0px;
        background-color: #fff;
    }
    @media (max-width: 960px) {
        .recommend {
            display: none;
        }
    }

    .item-headline {
        text-align: center;
        font-size: 18px;
    }

    .aside-list-item {
        padding: 5px 0;

        .content-box {
            display: flex;
            flex-direction: column;

            .content {
                color: #2e3135;
                font-size: 14px;
                line-height: 22px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                text-overflow: ellipsis;
                overflow: hidden;
                -webkit-line-clamp: 2;
                max-width: 200px;
                max-height: 36px;
            }

            .stat {
                color: #76797e;
                font-size: 12px;
                line-height: 20px;
                margin-top: 4px;
            }
        }

        .image-box {
            width: 68px;
            height: 68px;
            margin-left: 12px;
            border-radius: 4px;
            background-position: 50%;
            background-size: cover;
            background-repeat: no-repeat;
        }
    }
</style>
