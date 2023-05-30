<template>
    <div class="container mx-auto my-0px">
        <div class="edit-box-wrapper">
            <MessageEditBox
                ref="editBox"
                @submit="handleSubmit"
                edit-box-min-height="75px"
                placeholder="发布新鲜事~"
                input-id="messageImageInput"
                :isSubmitting="data.isSubmitting"
                :hide-action="false"
                :maxImageNum="9"
            />
        </div>
        <!--推荐和动态tab栏-->
        <a-tabs v-model:activeKey="activeKey" centered>
            <a-tab-pane :key="item.key" :tab="item.value" v-for="item in tabs">
                <component :is="item.component" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts" setup>
    import { postDiscussionCreate } from '@/api/article';
    import { uploadApi } from '@/api/sys/upload';
    import MessageEditBox from './components/editBox.vue';
    import { reactive, ref } from 'vue';
    import Recommend from '@/views/discussion/recommend.vue';
    import Subscribe from '@/views/discussion/subscribe.vue';
    import { useRouter } from 'vue-router';
    const editBox = ref();
    const data = reactive({
        //是否正在提交中
        isSubmitting: false,
        //上传图片的列表
        imgListToUpload: [],
        //上传的内容
        textContent: '',
    });
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
    const router = useRouter();
    async function handleSubmit(imageList, text) {
        data.isSubmitting = true;
        const imgUrlList = await uploadImg(imageList);
        const temp = await postDiscussionCreate({
            image: imgUrlList.join(';'),
            content: text,
        });
        data.isSubmitting = false;
        editBox.value.resetAfterSubmit();
        router.push({ name: 'discussion-item', params: { id: temp.id } });
    }
    const activeKey = ref('recommend');
    const tabs = [
        {
            key: 'recommend',
            component: Recommend,
            value: '推荐',
        },
        {
            key: 'subscribe',
            component: Subscribe,
            value: '最新',
        },
    ];
</script>

<style scoped lang="less">
    .container {
        width: 640px;
        margin: 0 auto;

        .edit-box-wrapper {
            padding: 20px 20px 10px 20px;
            background-color: #fff;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        :deep(.ant-tabs-nav) {
            background-color: #fff;
            margin: 8px 0px;
        }
    }
</style>
