export const discussion = [
    {
        path: '/discussion',
        name: 'discussion',
        component: () => import('@/views/discussion/index.vue'),
        meta: {
            title: '讨论区',
        },
    },
    {
        path: '/discussion/:id',
        name: 'discussion-item',
        component: () => import('@/views/discussion/item.vue'),
        meta: {
            title: '讨论',
        },
    },
];
export default discussion;
