<!-- eslint-disable vue/no-v-html -->
<template>
    <div style="background: #fff">
        <div class="container">
            <div class="title-info">
                <h3 class="title">{{ form.title }}</h3>
                <div class="date">
                    {{ form.add_time.split(' ')[0] }}
                </div>
            </div>
            <div class="content news-info">
                <div v-html="content"></div>
            </div>
            <div class="prev-box flex justify-between">
                <dl class="fl">
                    <template v-if="form.previous && form.previous.id">
                        <router-link
                            :to="{
                                name: 'news-detail',
                                params: { id: form.previous.id },
                            }"
                        >
                            {{ form.previous.title }}
                        </router-link>
                    </template>
                    <template v-else>没有数据了</template>
                </dl>
                <dl class="fr">
                    <template v-if="form.next && form.next.id">
                        <router-link
                            :to="{
                                name: 'news-detail',
                                params: { id: form.next.id },
                            }"
                        >
                            {{ form.next.title }}
                        </router-link>
                    </template>
                    <template v-else>没有数据了</template>
                </dl>
            </div>
            <div class="h-200px"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { NewsItem } from '@/models/news';
    import { computed, watch, reactive } from 'vue';
    import DOMPurify from 'dompurify';
    import { useRoute } from 'vue-router';
    const props = defineProps({
        api: {
            type: Function,
            require: true,
        },
    });
    const form = reactive<NewsItem>({
        title: '',
        content: '',
        add_time: '',
        previous: { id: '', title: '' },
        next: { id: '', title: '' },
    });
    const content = computed(() => {
        return DOMPurify.sanitize(form.content);
    });
    const route = useRoute();
    const articleId = route.params.id;
    watch(
        () => props.api,
        async (api) => {
            if (api) {
                const res = await api(articleId);
                Object.assign(form, res);
            }
        },
        { immediate: true },
    );
</script>
<style lang="less" scoped>
    .container {
        background-color: #fff;
        min-height: calc(100vh - 64px);
        margin: 0 auto;
    }

    .title-info {
        color: #888888;
        line-height: 30px;
        padding: 24px 0px;
        margin-bottom: 25px;
        text-align: center;
        border: 1px solid #e5e5e5;
        clear: both;

        .title {
            font-size: 28px;
            font-weight: normal;
            color: #222;
            padding-bottom: 10px;
        }

        .date {
            margin: 0px 10px;
            display: inline-block;
        }
    }

    .content {
        color: #333;
        width: 80%;
        margin: 0px auto;
    }

    .prev-box {
        width: 80%;
        margin: 0px auto;
        margin: 50px auto 0;
        position: relative;
        color: #888888;

        dl {
            width: 49%;
            line-height: 50px;
            height: 50px;
            text-align: center;
            overflow: hidden;
            background: #f7f7f7;

            a {
                display: block;
                text-overflow: ellipsis;
                *white-space: nowrap;
                overflow: hidden;
                width: 100%;
            }

            &:hover {
                a {
                    background: #912228;
                    color: #fff;
                }
            }
        }
    }
</style>
