<template>
    <a-form
        class="loginForm sign-in-form"
        :model="formData"
        :rules="getFormRules"
        ref="formRef"
        @keypress.enter="handleLogin"
    >
        <a-form-item label="邮箱" name="email">
            <a-auto-complete
                v-model:value="formData.email"
                @search="onSearch"
                :options="options"
                placeholder="请输入邮箱"
                allowClear
            />
        </a-form-item>
        <a-form-item label="密码" name="password">
            <a-input-password
                v-model:value="formData.password"
                :placeholder="t('sys.login.password')"
            >
                <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                </template>
            </a-input-password>
        </a-form-item>

        <a-row class="enter-x">
            <a-col :span="12">
                <a-form-item name="remember" no-style>
                    <a-checkbox v-model:checked="formData.remember">记住我</a-checkbox>
                </a-form-item>
            </a-col>
            <ACol :span="12">
                <a-form-item :style="{ 'text-align': 'right' }">
                    <a-button
                        type="link"
                        size="small"
                        @click="setLoginState(LoginStateEnum.RESET_PASSWORD)"
                    >
                        {{ t('sys.login.forgetPassword') }}
                    </a-button>
                </a-form-item>
            </ACol>
        </a-row>

        <a-form-item class="enter-x">
            <a-button type="primary" size="large" block @click="handleLogin" :loading="loading">
                {{ t('sys.login.loginButton') }}
            </a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts" setup>
    import { reactive, ref } from 'vue';
    import { LockOutlined } from '@ant-design/icons-vue';
    import { useI18n } from '@/hooks/web/useI18n';

    import { useUserStoreWithOut } from '@/store/modules/user';
    import {
        LoginStateEnum,
        useLoginState,
        useFormRules,
        useFormValid,
        queryEmail,
    } from './useLogin';
    import { useMessage } from '@/hooks/useMessage';
    const { t } = useI18n();
    const userStore = useUserStoreWithOut();

    const { setLoginState } = useLoginState();
    const { getFormRules } = useFormRules();
    const formRef = ref();
    const loading = ref(false);
    interface FormState {
        email: string;
        password: string;
        remember: boolean;
    }
    interface MockVal {
        value: string;
    }
    const options = ref<MockVal[]>([]);
    const onSearch = (searchText: string) => {
        options.value = !searchText ? [] : queryEmail(searchText);
    };
    const formData = reactive<FormState>({
        email: '',
        password: '',
        remember: true,
    });

    const { validForm } = useFormValid(formRef);
    const { createErrorModal } = useMessage();
    async function handleLogin() {
        const data = await validForm();
        if (!data) return;
        try {
            loading.value = true;
            await userStore.login({
                password: data.password,
                email: data.email,
                remember: data.remember,
            });
        } catch (error) {
            createErrorModal({
                title: t('sys.api.errorTip'),
                content: (error as any).response?.data?.message || t('sys.api.networkExceptionMsg'),
                getContainer: () => document.body,
            });
        } finally {
            loading.value = false;
        }
    }
</script>
<style lang="less" scoped>
    .loginForm {
        background-color: #fff;
        padding: 20px 40px 20px 20px;
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
        padding: 0rem 5rem;
        transition: all 0.2s 0.7s;
        overflow: hidden;
    }

    form.sign-in-form {
        z-index: 2;
    }
</style>
