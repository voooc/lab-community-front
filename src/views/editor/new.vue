<template>
    <div class="editor-new">
        <div class="header flex items-center">
            <div class="h-50px w-full"></div>
            <div class="right-box flex items-center">
                <a-button type="primary" class="mx-8px" @click="send">{{
                    id ? '更新' : '发布'
                }}</a-button>
            </div>
        </div>
        <div class="content h-[calc(100vh-50px)]">
            <MdEditor
                ref="markDownRef"
                placeholder="请输入"
                v-model:content="data.content"
                v-model:code="data.code_highlight"
                v-model:preview="data.preview"
                editorId="article-item"
            />
        </div>
        <Modal @register="registerModal" />
    </div>
</template>
<script lang="ts" setup>
    import { ref, reactive, onMounted } from 'vue';
    import { useModal } from '@/components/Modal';
    import Modal from './createModal.vue';
    import { MdEditor } from '@/components/Markdown';
    import { createLocalStorage } from '@/utils/cache';
    import { MARKDOWN_SAVE_KEY } from '@/enums/cacheEnum';
    import { getArticleDetail } from '@/api/article';
    import { useRouter } from 'vue-router';
    import { ArticleItem } from '@/models/article';
    const ls = createLocalStorage();
    const markDownRef = ref();
    const data = reactive({
        code_highlight: 'atom',
        preview: 'default',
        content: ls.get(MARKDOWN_SAVE_KEY) || '',
    });
    const [registerModal, { openModal }] = useModal();
    const router = useRouter();
    interface Model {
        info: Nullable<ArticleItem>;
    }
    const temp: Model = reactive({
        info: null,
    });
    async function send() {
        if (!id) {
            const res = markDownRef.value.getValue();
            openModal(true, {
                content: res.content,
                code_highlight: res.code,
                preview: res.preview,
            });
        } else {
            const res = markDownRef.value.getValue();
            if (temp.info) {
                temp.info.content = res.content;
                temp.info.code_highlight = res.code;
                temp.info.preview = res.preview;
                openModal(true, temp.info);
            }
        }
    }
    const id = router.currentRoute.value.params.id;
    onMounted(async () => {
        if (id) {
            const res: ArticleItem = await getArticleDetail(id);
            data.code_highlight = res.code_highlight;
            data.preview = res.preview;
            data.content = res.content;
            temp.info = res;
        }
    });
</script>
<style lang="less" scoped>
    .editor-new {
        background-color: #fff;
    }
</style>
