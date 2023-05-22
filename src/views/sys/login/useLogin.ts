import type { RuleObject } from 'ant-design-vue/lib/form/interface';
import { ref, computed, unref, Ref } from 'vue';

export enum LoginStateEnum {
    LOGIN,
    REGISTER,
    RESET_PASSWORD,
}

const currentState = ref(LoginStateEnum.LOGIN);

export function useLoginState() {
    function setLoginState(state: LoginStateEnum) {
        currentState.value = state;
    }

    const getLoginState = computed(() => currentState.value);

    function handleBackLogin() {
        setLoginState(LoginStateEnum.LOGIN);
    }

    return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<any>) {
    async function validForm() {
        const form = unref(formRef);
        if (!form) return;
        const data = await form.validate();
        return data as T;
    }

    return { validForm };
}

export function useFormRules(formData?: Recordable) {
    const getPasswordFormRule = computed(() => createRule('请输入密码'));
    const validateCaptcha = (email: string) => {
        return async (_: RuleObject, value: string) => {
            if (!email) {
                return Promise.reject('请输入邮箱');
            }
            if (!value) {
                return Promise.reject('请输入验证码');
            }
            return Promise.resolve();
        };
    };
    const validateConfirmPassword = (password: string) => {
        return async (_: RuleObject, value: string) => {
            if (!value) {
                return Promise.reject('请输入密码');
            }
            if (value !== password) {
                return Promise.reject('两次输入密码不一致');
            }
            return Promise.resolve();
        };
    };

    const getFormRules = computed(() => {
        const passwordFormRule = unref(getPasswordFormRule);
        switch (unref(currentState)) {
            case LoginStateEnum.REGISTER:
                return {
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        {
                            required: true,
                            type: 'email',
                            message: '请输入正确的邮箱格式',
                            trigger: 'blur',
                        },
                    ],
                    password: passwordFormRule,
                    confirmPassword: [
                        {
                            validator: validateConfirmPassword(formData?.password),
                            trigger: 'change',
                        },
                    ],
                    captcha: [
                        {
                            validator: validateCaptcha(formData?.email),
                            trigger: 'change',
                        },
                    ],
                };
            case LoginStateEnum.RESET_PASSWORD:
                return {
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        {
                            required: true,
                            type: 'email',
                            message: '请输入正确的邮箱格式',
                            trigger: 'blur',
                        },
                    ],
                    captcha: [
                        {
                            validator: validateCaptcha(formData?.email),
                            trigger: 'change',
                        },
                    ],
                    password: passwordFormRule,
                };
            default:
                return {
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        {
                            required: true,
                            type: 'email',
                            message: '请输入正确的邮箱格式',
                            trigger: 'blur',
                        },
                    ],
                    password: passwordFormRule,
                };
        }
    });
    return { getFormRules };
}

function createRule(message: string) {
    return [
        {
            required: true,
            message,
            trigger: 'change',
        },
    ];
}
export function queryEmail(queryString: string) {
    const emailList = [
        { value: '@qq.com' },
        { value: '@163.com' },
        { value: '@gmail.com' },
        { value: '@foxmail.com' },
        { value: '@sina.com' },
        { value: '@126.com' },
        { value: '@sohu.com' },
        { value: '@yahoo.com.cn' },
        { value: '@msn.com' },
        { value: '@hotmail.com' },
        { value: '@ask.com' },
    ];
    let results: { value: string }[] = [];
    const queryList: { value: string }[] = [];
    // 提取出所有邮箱
    emailList.map((item) => {
        return queryList.push({ value: queryString.split('@')[0] + item.value });
    });
    // 邮箱填写过滤
    function createFilter(query) {
        return query.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    }
    results = queryString ? queryList.filter(createFilter) : queryList;
    return results;
}
