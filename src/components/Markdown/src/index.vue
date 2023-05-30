<template>
    <div class="project-preview" style="height: inherit">
        <div class="markdown-container h-full">
            <MdEditor
                ref="editorRef"
                class="!h-full"
                placeholder="请输入"
                :editorId="editorId"
                v-model:previewTheme="preview"
                v-model:code="code"
                theme="light"
                v-model:modelValue="content"
                language="zh-CN"
                v-bind="$attrs"
                @on-save="onSave"
                :codeTheme="code"
                @on-upload-img="uploadImg"
                :toolbars="toolbars"
            >
                <template #defToolbars>
                    <EmojiExtension :onInsert="insert" />
                    <theme-extension type="code" @code="onChangeCode" />
                    <theme-extension type="preview" @code="onChangePreview" />
                </template>
            </MdEditor>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from 'vue';
    export default defineComponent({
        name: 'MdEditor',
    });
</script>
<script lang="ts" setup>
    import MdEditor from 'md-editor-v3';
    import 'md-editor-v3/lib/style.css';
    import { toolbars } from './data';
    import EmojiExtension from './EmojiExtension.vue';
    import highlight from 'highlight.js';
    import ThemeExtension from './ThemeExtension.vue';
    import './index.less';
    import { uploadApi } from '@/api/sys/upload';
    import type { ExposeParam, InsertContentGenerator } from 'md-editor-v3';
    import { onUnmounted, watch, ref, onMounted, defineExpose, defineProps } from 'vue';
    import { createLocalStorage } from '@/utils/cache';
    import { MARKDOWN_SAVE_KEY } from '@/enums/cacheEnum';
    MdEditor.config({
        editorExtensions: {
            highlight: {
                instance: highlight,
            },
        },
    });
    const ls = createLocalStorage();
    const props = defineProps({
        content: {
            type: String as PropType<string>,
            default: '',
        },
        code: {
            type: String as PropType<string>,
            default: 'atom',
        },
        preview: { type: String as PropType<string>, default: 'default' },
        editorId: {
            type: String as PropType<string>,
            required: true,
        },
    });
    const insert = (generator: InsertContentGenerator) => {
        editorRef.value?.insert(generator);
    };
    const content = ref('');
    const code = ref('');
    const editorId = ref('');
    const preview = ref('');
    watch(
        () => [props.code, props.content, props.editorId, props.preview],
        () => {
            if (props.code) {
                code.value = props.code;
            }
            if (props.content) {
                content.value = props.content;
            }
            if (props.editorId) {
                editorId.value = props.editorId;
            }
            if (props.preview) {
                preview.value = props.preview;
            }
        },
        {
            immediate: true,
        },
    );
    const onChangeCode = (value) => {
        code.value = value;
    };
    const onChangePreview = (value) => {
        preview.value = value;
    };
    const editorRef = ref<ExposeParam>();
    // 自动保存
    let taskId = -1;
    function getValue() {
        return { content: content.value, code: code.value, preview: preview.value };
    }
    watch(
        () => content.value,
        () => {
            clearInterval(taskId);
            taskId = window.setTimeout(() => {
                ls.set(MARKDOWN_SAVE_KEY, content.value);
            }, 2_000);
        },
    );
    defineExpose({ getValue });
    onMounted(() => {
        editorRef.value?.on('preview', (status) => {
            console.log('preview', status);
        });

        editorRef.value?.on('htmlPreview', (status) => {
            console.log('htmlPreview', status);
        });

        editorRef.value?.on('pageFullscreen', (status) => {
            console.log('pageFullscreen', status);
        });

        editorRef.value?.on('fullscreen', (status) => {
            console.log('fullscreen', status);
        });

        editorRef.value?.on('catalog', (status) => {
            console.log('catalog', status);
        });
    });
    const onSave = (v) => {
        ls.set(MARKDOWN_SAVE_KEY, v);
    };
    const uploadImg = async (files: Array<File>, callback: any) => {
        const res = await Promise.all(
            files.map((file) => {
                return new Promise(async (rev, rej) => {
                    uploadApi({ file: file }, () => {})
                        .then((res) => rev(res))
                        .catch((error) => rej(error));
                });
            }),
        );
        callback(
            res.map((item: any) => {
                return item;
            }),
        );
    };
    onUnmounted(() => {
        clearInterval(taskId);
    });
</script>
