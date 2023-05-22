export const user = [
    {
        path: '/user/settings/profile',
        name: 'user-settings',
        component: () => import('@/views/user/settings/profile.vue'),
        meta: {
            title: '个人资料',
        },
    },
];

export default user;
