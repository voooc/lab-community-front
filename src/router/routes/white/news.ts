export const news = [
    {
        path: '/news',
        name: 'news',
        component: () => import('@/views/news/index.vue'),
        meta: {
            title: '文章',
        },
    },
    {
        path: '/news/:id',
        name: 'news-detail',
        component: () => import('@/views/news/detail.vue'),
    },
];
export default news;
