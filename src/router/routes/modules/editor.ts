export const editor = [
    {
        path: '/editor',
        name: 'editor',
        redirect: '/editor/new',
        meta: {
            title: '编辑',
            hideHeader: true,
        },
        children: [
            {
                path: 'new',
                name: 'editor-new',
                component: () => import('@/views/editor/new.vue'),
                meta: {
                    title: '写文章',
                    hideHeader: true,
                },
            },
        ],
    },
    {
        path: '/editor/:id',
        name: 'editor-detail',
        component: () => import('@/views/editor/new.vue'),
        meta: {
            title: '修改文章',
            hideHeader: true,
        },
    },
];

export default editor;
