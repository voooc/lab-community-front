<template>
    <CollapseContainer title="基本设置" :canExpan="false">
        <a-row :gutter="24">
            <a-col :span="14">
                <BasicForm @register="register">
                    <template #department="{ model, field }">
                        <ApiSelect
                            :api="GetDepartmentInfo"
                            style="width: 100%"
                            v-model:value="model[field]"
                            showSearch
                            optionFilterProp="label"
                            labelField="name"
                            valueField="id"
                            :filterOption="false"
                            resultField="items"
                        />
                    </template>
                </BasicForm>
            </a-col>
            <a-col :span="10">
                <div class="change-avatar">
                    <div class="mb-2">头像</div>
                    <a-upload
                        v-model:file-list="fileList"
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
                        <img v-if="image" :src="image" alt="avatar" class="w-full h-full" />
                        <div v-else>
                            <loading-outlined v-if="loading" />
                            <plus-outlined v-else />
                            <div class="ant-upload-text">Upload</div>
                        </div>
                    </a-upload>
                </div>
            </a-col>
        </a-row>
        <a-button type="primary" @click="handleSubmit"> 更新基本信息 </a-button>
    </CollapseContainer>
</template>
<script lang="ts" setup>
    import { computed, watch, nextTick, ref } from 'vue';
    import { BasicForm, useForm, ApiSelect } from '@/components/Form/index';
    import { CollapseContainer } from '@/components/Container';
    import { useMessage } from '@/hooks/web/useMessage';
    import { baseSetschemas } from './data';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import { uploadApi } from '@/api/sys/upload';
    import { GetDepartmentInfo, postUserInfo } from '@/api/sys/user';
    import { UploadChangeParam } from 'ant-design-vue';
    const { createMessage } = useMessage();

    const [register, { setFieldsValue, getFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: baseSetschemas,
        showActionButtonGroup: false,
    });
    const userStore = useUserStoreWithOut();
    const userInfo = computed(() => {
        const { username, image, department, desc } = userStore.getUserInfo;
        return { username, image, department, desc };
    });

    const fileList = ref<Array<any>>([]);
    const loading = ref<boolean>(false);
    const image = ref(userInfo.value.image);
    const handleUpload = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
            loading.value = true;
            return;
        }
        if (info.file.status === 'done') {
            image.value = info.file.response.result;
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
    watch(
        () => userInfo.value.username,
        (value: boolean) => {
            value &&
                nextTick(() => {
                    setFieldsValue(userInfo.value);
                });
        },
        { immediate: true },
    );

    async function handleSubmit() {
        const res = {
            ...getFieldsValue(),
            image: fileList.value[0]?.response[0] || userInfo.value.image,
        };
        const temp = Object.assign(userStore.getUserInfo, res);
        userStore.setUserInfo(temp);
        await postUserInfo(res);
        createMessage.success('更新成功！');
    }
</script>
