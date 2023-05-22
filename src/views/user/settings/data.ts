import { FormSchema } from '@/components/Form/index';
import BaseSetting from './BaseSetting.vue';
import SecureSetting from './SecureSetting.vue';
export interface ListItem {
    key: string;
    title: string;
    description: string;
    extra?: string;
    avatar?: string;
    color?: string;
}

// tab的list
export const settingList = [
    {
        key: '1',
        name: '基本设置',
        component: BaseSetting,
    },
    {
        key: '2',
        name: '安全设置',
        component: SecureSetting,
    },
];

// 基础设置 form
export const baseSetschemas: FormSchema[] = [
    {
        field: 'username',
        component: 'Input',
        label: '昵称',
        colProps: { span: 18 },
    },
    {
        field: 'desc',
        component: 'InputTextArea',
        label: '个人简介',
        colProps: { span: 18 },
    },
    {
        field: 'department',
        component: 'ApiSelect',
        label: '年级',
        colProps: { span: 18 },
        slot: 'department',
    },
];
// 安全设置 list
export const secureSettingList: ListItem[] = [
    {
        key: '1',
        title: '账户密码',
        description: '当前密码强度：强',
        extra: '修改',
    },
];
