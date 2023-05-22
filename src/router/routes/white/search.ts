export const search = {
    path: '/search',
    name: 'search',
    meta: {
        title: '搜索',
    },
    component: () => import('@/views/search/index.vue'),
};

export default search;
