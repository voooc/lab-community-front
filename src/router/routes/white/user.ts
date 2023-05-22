export const user = [
    {
        path: '/user/:id',
        name: 'user-center',
        component: () => import('@/views/user/center/index.vue'),
        meta: {
            title: '个人中心',
        },
        redirect: { name: 'user-article' },
        children: [
            {
                path: 'article',
                name: 'user-article',
                component: () => import('@/views/user/center/article.vue'),
                meta: {
                    title: '个人文章',
                },
            },
            {
                path: 'follow',
                name: 'user-follow',
                component: () => import('@/views/user/center/follow.vue'),
                meta: {
                    title: '个人关注',
                },
            },
            {
                path: 'like',
                name: 'user-like',
                component: () => import('@/views/user/center/like.vue'),
                meta: {
                    title: '个人点赞',
                },
            },
        ],
    },
];

export default user;
