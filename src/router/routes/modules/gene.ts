import { LAYOUT } from '@/constants/router';

const gene = {
    path: '/gene',
    name: 'Gene',
    component: LAYOUT,
    redirect: '/gene/index',
    meta: {
        title: '任务数据查询',
    },
    children: [
        {
            path: 'index',
            name: 'GeneIndex',
            component: () => import('@/views/welcome/index.vue'),
            meta: {
                title: '任务数据查询',
                showInbreadcrumb: false,
            },
        },
    ],
};
export default gene;
