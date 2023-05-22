export const announcement = [
    {
        path: '/scienist',
        name: 'scienist',
        meta: {
            title: '科学研究',
        },
        redirect: { name: 'announcement' },
        children: [
            {
                path: 'announcement',
                name: 'announcement',
                component: () => import('@/views/scientist/announcement/index.vue'),
                meta: {
                    title: '通知公告',
                },
            },
            {
                path: 'announcement/:id',
                name: 'announcement-detail',
                component: () => import('@/views/scientist/announcement/detail.vue'),
                meta: {
                    title: '通知公告',
                },
            },
            {
                path: 'research',
                name: 'research',
                component: () => import('@/views/scientist/research/index.vue'),
                meta: {
                    title: '荣誉奖项',
                },
            },
        ],
    },
];
export default announcement;
