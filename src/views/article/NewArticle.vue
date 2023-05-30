<template>
    <div class="item-headline">
        <span>热门推荐</span>
    </div>
    <div class="aside-new-lists">
        <div v-for="(item, index) in data" :key="index" class="aside-list-item">
            <router-link
                :to="{
                    name: 'article-item',
                    params: { id: item.id },
                }"
                class="thumbnail"
            >
                <img :src="item.avatar" :alt="item.title" />
            </router-link>
            <div class="content">
                <router-link
                    :to="{
                        name: 'article-item',
                        params: { id: item.id },
                    }"
                    >{{ item.title }}</router-link
                >
                <Time :value="item.add_time" style="font-size: 12px" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { Time } from '@/components/Time';
    import { onMounted, ref } from 'vue';
    import { getArticleAll } from '@/api/article/index';
    import { ArticleItem } from '@/models/article';
    const data = ref<Array<ArticleItem>>([]);
    onMounted(async () => {
        const res = (
            await getArticleAll({
                page: 1,
                pageSize: 5,
                ordering: 'view',
            })
        ).items;
        data.value = res;
    });
</script>
<style scoped lang="less">
    .item-headline {
        text-align: center;
        font-size: 18px;
    }

    .aside-list-item {
        display: flex;
        align-items: center;
        padding: 5px 0;
        margin-top: 5px;

        .content {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding-left: 10px;

            .title {
                font-size: 95%;
                height: 1.5;
            }
        }
    }

    time {
        display: block;
        font-size: 85%;
        color: #858585;
    }

    .thumbnail {
        width: 4.2em;
        height: 4.2em;
    }

    .thumbnail img {
        width: 100%;
        height: 100%;
    }
</style>
