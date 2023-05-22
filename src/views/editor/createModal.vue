<template>
    <BasicModal
        title="发布文章"
        okText="确定并发布"
        v-bind="$attrs"
        @register="register"
        class="pulish-modal"
        @ok="handleFinish"
    >
        <a-form ref="formRef" :model="formState">
            <a-form-item
                label="标题"
                name="title"
                :rules="[{ required: true, message: '请输入标题' }]"
            >
                <a-input v-model:value="formState.title" />
            </a-form-item>
            <a-form-item
                label="分类"
                name="category_id"
                :rules="[{ required: true, message: '请选择类别' }]"
            >
                <a-checkable-tag
                    v-for="tag in data.category"
                    :key="tag.id"
                    :checked="formState.category_id === tag.id"
                    @change="(checked) => handleChange(tag.id, checked)"
                    :style="{
                        'background-color':
                            formState.category_id === tag.id ? '#1890ff' : '#f4f5f5',
                    }"
                >
                    {{ tag.name }}
                </a-checkable-tag>
            </a-form-item>
            <a-form-item
                label="标签"
                name="tags_id"
                :rules="[
                    {
                        required: true,
                        message: '请选择标签!',
                        type: 'array',
                    },
                ]"
            >
                <a-select
                    v-model:value="formState.tags_id"
                    mode="multiple"
                    style="width: 70%"
                    :field-names="{ label: 'name', value: 'id' }"
                    placeholder="Please select"
                    :options="data.tag"
                />
            </a-form-item>
            <a-form-item
                label="文章封面"
                name="avatar"
                :rules="[{ required: true, message: '请上传文章封面图' }]"
            >
                <a-upload
                    v-model:file-list="formState.avatar"
                    name="file"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    action="http://127.0.0.1:8000/api/upload"
                    :before-upload="beforeUpload"
                    @change="handleUpload"
                    :customRequest="downloadFilesCustomRequest"
                    :headers="{ 'X-Requested-With': null }"
                >
                    <img
                        v-if="formState.avatar[0]"
                        :src="formState.avatar[0]"
                        alt="avatar"
                        class="w-full h-full"
                    />
                    <div v-else>
                        <loading-outlined v-if="loading" />
                        <plus-outlined v-else />
                        <div class="ant-upload-text">Upload</div>
                    </div>
                </a-upload>
            </a-form-item>
            <a-form-item
                label="编辑摘要"
                name="desc"
                :rules="[{ required: true, message: '请输入摘要' }]"
            >
                <a-textarea v-model:value="formState.desc" show-count :maxlength="100" />
            </a-form-item>
        </a-form>
    </BasicModal>
</template>
<script lang="ts" setup>
    import { reactive, onMounted, ref } from 'vue';
    import { BasicModal, useModalInner } from '@/components/Modal';
    import {
        getArticleCategory,
        getArticleTag,
        postArticleCreate,
        putArticle,
    } from '@/api/article/index';
    import { uploadApi } from '@/api/sys/upload';
    import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
    import type { FormInstance, UploadChangeParam } from 'ant-design-vue';
    import { useMessage } from '@/hooks/web/useMessage';
    import { useRouter } from 'vue-router';
    import { createLocalStorage } from '@/utils/cache';
    import { MARKDOWN_SAVE_KEY } from '@/enums/cacheEnum';
    const { createMessage } = useMessage();
    const ls = createLocalStorage();
    const router = useRouter();
    const [register, { closeModal }] = useModalInner((data) => {
        data && onDataReceive(data);
    });
    const formState = reactive({
        title: '',
        tags_id: [],
        desc: '',
        content: '',
        avatar: [],
        category_id: '',
        code_highlight: '',
        preview: '',
    });
    interface TagItem {
        id: string;
        name: string;
    }
    const id = ref();
    const data = reactive({
        category: [] as TagItem[],
        tag: [] as TagItem[],
    });
    const handleChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked ? tag : '';
        formState.category_id = nextSelectedTags;
    };
    function onDataReceive(data) {
        formState.content = data.content;
        formState.code_highlight = data.code_highlight;
        formState.preview = data.preview;
        if (data.id) {
            id.value = data.id;
            formState.title = data.title;
            formState.category_id = data.category.id;
            formState.tags_id = data.tags.map((item) => {
                return item.id;
            });
            formState.desc = data.desc;
            // @ts-ignore
            formState.avatar = [data.avatar];
        }
    }
    const formRef = ref<FormInstance>();
    const handleFinish = async () => {
        const res = await formRef.value?.validateFields();
        if (!res) return;
        res.url = window.location.origin;
        res.avatar = res.avatar[0];
        let temp;
        if (id.value) {
            temp = await putArticle(res, id.value);
        } else {
            temp = await postArticleCreate(res);
            ls.remove(MARKDOWN_SAVE_KEY);
        }
        closeModal();
        router.push({ path: `/article/${temp['id']}` });
    };
    const loading = ref<boolean>(false);

    const handleUpload = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
            loading.value = true;
            return;
        }
        if (info.file.status === 'done') {
            // @ts-ignore
            formState.avatar = [info.file.response];
            loading.value = false;
        }
        if (info.file.status === 'error') {
            loading.value = false;
            createMessage.error('upload error');
        }
    };
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            createMessage.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            createMessage.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };
    const downloadFilesCustomRequest = async (e) => {
        try {
            const res = await uploadApi(
                { file: e.file },
                function onUploadProgress(progressEvent: ProgressEvent) {
                    const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
                    e.onProgress({ complete });
                },
            );
            e.onSuccess(res, e);
        } catch (err) {
            e.onError(err);
        }
    };
    onMounted(async () => {
        const res1 = (await getArticleCategory({})).items;
        data.category = res1;
        const res2 = (await getArticleTag({})).items;
        data.tag = res2;
    });
</script>
<style lang="less" scoped></style>
