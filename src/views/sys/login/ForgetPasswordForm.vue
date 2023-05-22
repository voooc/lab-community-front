<template>
    <a-form ref="formRef" :rules="getFormRules" :model="formData" class="loginForm sign-in-form">
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
        <a-form-item>
            <a-button type="primary" size="large" block @click="handleBackLogin">
                {{ t('common.back') }}
            </a-button>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" size="large" block @click="handleFinish" :loading="loading">
                {{ t('sys.login.forgetFormTitle') }}
            </a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts" setup>
    import { reactive, ref } from 'vue';
    import { CountdownInput } from '@/components/CountDown';
    import { LockOutlined } from '@ant-design/icons-vue';
    import { retrieveSms, retrieve } from '@/api/sys/user';
    import { useI18n } from '@/hooks/web/useI18n';
    import { queryEmail, useFormValid } from '@/views/sys/login/useLogin';
    import { useMessage } from '@/hooks/useMessage';
    import { useLoginState, useFormRules } from './useLogin';
    const { t } = useI18n();
    const formRef = ref();
    const loading = ref(false);
    const { notification } = useMessage();
    const { handleBackLogin } = useLoginState();
    const formData = reactive({
        email: '',
        captcha: '',
        password: '',
    });
    const { getFormRules } = useFormRules(formData);
    const { validForm } = useFormValid(formRef);
    async function handleFinish() {
        loading.value = true;
        const data = await validForm();
        if (!data) return;
        await retrieve(formData);
        notification.info({ message: '密码修改成功' });
        handleBackLogin();
        loading.value = false;
    }
    const onSearch = (searchText: string) => {
        options.value = !searchText ? [] : queryEmail(searchText);
    };
    interface MockVal {
        value: string;
    }
    const options = ref<MockVal[]>([]);
</script>
<style lang="less" scoped>
    .loginForm {
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0px 5px 10px #cccc;
        position: relative;
        top: 200px;

        .submit-btn {
            width: 100%;
        }

        .tiparea {
            text-align: right;
            font-size: 12px;
            color: #333;

            p a {
                color: #409eff;
            }
        }
    }
    /* 控制login & register显示 */
    form {
        padding: 1.5rem;
        transition: all 0.2s 0.7s;
        overflow: hidden;
    }

    form.sign-in-form {
        z-index: 2;
    }
</style>
