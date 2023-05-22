export const about = [
    {
        path: '/about',
        name: 'about',
        meta: {
            title: '关于我们',
        },
        redirect: { name: 'overview' },
        children: [
            {
                path: 'overview',
                name: 'overview',
                component: () => import('@/views/about/overview/index.vue'),
                meta: {
                    title: '实验室概况',
                },
            },
            {
                path: 'people',
                name: 'people',
                component: () => import('@/views/about/people/index.vue'),
                meta: {
                    title: '实验室成员',
                },
            },
            {
                path: 'enviroment',
                name: 'enviroment',
                component: () => import('@/views/about/enviroment/index.vue'),
                meta: {
                    title: '实验室环境',
                },
            },
            {
                path: 'contact',
                name: 'contact',
                component: () => import('@/views/about/contact/index.vue'),
                meta: {
                    title: '联系我们',
                },
            },
        ],
    },
];
export default about;
