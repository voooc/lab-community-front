<template>
    <a-form class="registerForm sign-up-form" :model="formData" :rules="getFormRules" ref="formRef">
        <a-form-item
            label="用户名"
            name="username"
            :rules="[{ required: true, message: '请输入用户名!' }]"
        >
            <a-input v-model:value="formData.username" placeholder="请输入用户名" />
        </a-form-item>
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
            <a-input-password v-model:value="formData.password">
                <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                </template>
            </a-input-password>
        </a-form-item>

        <a-form-item label="确认密码" name="confirmPassword" class="enter-x">
            <a-input-password
                size="large"
                visibilityToggle
                v-model:value="formData.confirmPassword"
                placeholder="请再次输入密码"
            />
        </a-form-item>

        <a-form-item
            label="名字"
            name="name"
            :rules="[{ required: true, message: '请输入真实姓名!' }]"
        >
            <a-input v-model:value="formData.name" placeholder="请输入真实姓名" />
        </a-form-item>
        <a-form-item name="department" label="年级">
            <ApiSelect
                :api="GetDepartmentInfo"
                style="width: 100%"
                v-model:value="formData.department"
                showSearch
                optionFilterProp="label"
                labelField="name"
                valueField="id"
                :filterOption="false"
                resultField="items"
            />
        </a-form-item>
        <a-form-item name="captcha" label="验证码" class="enter-x">
            <CountdownInput
                size="large"
                class="fix-auto-fill"
                v-model:value="formData.captcha"
                :api="registerSms"
                apiFieled="email"
                :params="formData.email"
                :placeholder="t('sys.login.smsCode')"
            />
        </a-form-item>

        <a-button
            type="primary"
            class="enter-x"
            size="large"
            block
            @click="handleRegister"
            :loading="loading"
        >
            {{ t('sys.login.registerButton') }}
        </a-button>
    </a-form>
</template>
<script lang="ts" setup>
    import { ApiSelect } from '@/components/Form/index';
    import { reactive, ref } from 'vue';
    import { useI18n } from '@/hooks/web/useI18n';
    import { LockOutlined } from '@ant-design/icons-vue';
    import { CountdownInput } from '@/components/CountDown';
    import { registerSms, GetDepartmentInfo, register } from '@/api/sys/user';
    import { useFormRules, useFormValid, queryEmail } from './useLogin';
    import { LoginStateEnum, useLoginState } from './useLogin';
    import { useMessage } from '@/hooks/useMessage';
    import { router } from '@/router';
    import { PageEnum } from '@/enums/pageEnum';
    const { setLoginState } = useLoginState();
    const { t } = useI18n();
    const formRef = ref();
    const loading = ref(false);
    const { notification } = useMessage();
    const formData = reactive({
        email: '',
        password: '',
        username: '',
        name: '',
        confirmPassword: '',
        sex: 0,
        captcha: '',
        department: '',
    });

    const { getFormRules } = useFormRules(formData);
    const { validForm } = useFormValid(formRef);
    async function handleRegister() {
        const data = await validForm();
        if (!data) return;
        await register(data);
        notification.info({ message: '请等待管理员进行审核，五个工作日内会审核完毕' });
        setLoginState(LoginStateEnum.LOGIN);
        router.push(PageEnum.BASE_LOGIN);
    }
    interface MockVal {
        value: string;
    }
    const options = ref<MockVal[]>([]);
    const onSearch = (searchText: string) => {
        options.value = !searchText ? [] : queryEmail(searchText);
    };
</script>
<style lang="less">
    .registerForm {
        background-color: #fff;
        padding: 20px 40px 20px 20px;
        border-radius: 5px;
        box-shadow: 0px 5px 10px #cccc;
        bottom: 30px;
        position: relative;
    }

    form {
        padding: 0rem 5rem;
        transition: all 0.2s 0.7s;
        overflow: hidden;
    }

    form.sign-up-form {
        opacity: 0;
        z-index: 1;
    }
</style>
