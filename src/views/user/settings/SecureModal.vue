<template>
    <BasicModal
        title="修改密码"
        okText="确认"
        v-bind="$attrs"
        @register="register"
        @ok="handleFinish"
    >
        <a-form ref="formRef" :rules="rules" :model="formData">
            <a-form-item label="原邮箱" name="email">
                <a-auto-complete
                    v-model:value="formData.email"
                    @search="onSearch"
                    :options="options"
                    placeholder="请输入邮箱"
                    allowClear
                />
            </a-form-item>
            <a-form-item name="captcha" label="验证码" class="enter-x">
                <CountdownInput
                    size="large"
                    class="fix-auto-fill"
                    v-model:value="formData.captcha"
                    :api="retrieveSms"
                    apiFieled="email"
                    :params="formData.email"
                />
            </a-form-item>
            <a-form-item label="密码" name="password">
                <a-input-password v-model:value="formData.password">
                    <template #prefix>
                        <LockOutlined class="site-form-item-icon" />
                    </template>
                </a-input-password>
            </a-form-item>
        </a-form>
    </BasicModal>
</template>
<script lang="ts" setup>
    import { BasicModal, useModal } from '@/components/Modal';
    import { reactive, ref } from 'vue';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import { CountdownInput } from '@/components/CountDown';
    import { LockOutlined } from '@ant-design/icons-vue';
    import { retrieveSms, retrieve } from '@/api/sys/user';
    import { queryEmail } from '@/views/sys/login/useLogin';
    interface MockVal {
        value: string;
    }
    const validateCaptcha = () => {
        return async (_: RuleObject, value: string) => {
            if (!formData.email) {
                return Promise.reject('请输入邮箱');
            }
            if (!value) {
                return Promise.reject('请输入验证码');
            }
            return Promise.resolve();
        };
    };
    const rules: Record<string, Rule[]> = {
        email: [
            { required: true, trigger: 'change' },
            {
                required: true,
                type: 'email',
                message: '请输入正确的邮箱格式',
                trigger: 'blur',
            },
        ],
        captcha: [{ validator: validateCaptcha, trigger: 'change' }],
        password: [{ required: true, trigger: 'change' }],
    };
    const options = ref<MockVal[]>([]);
    const [register, { closeModal }] = useModal();
    const formData = reactive({
        email: '',
        captcha: '',
        password: '',
    });
    const formRef = ref();
    const userStore = useUserStoreWithOut();
    async function handleFinish() {
        await retrieve(formData);
        await closeModal();
        await userStore.logout(true);
    }
    const onSearch = (searchText: string) => {
        options.value = !searchText ? [] : queryEmail(searchText);
    };
</script>
