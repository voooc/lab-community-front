export const article = [
    {
        path: '/article',
        name: 'article',
        component: () => import('@/views/article/index.vue'),
        meta: {
            title: '文章',
        },
    },
    {
        path: '/article/:id',
        name: 'article-item',
        component: () => import('@/views/article/item.vue'),
    },
];
export default article;
