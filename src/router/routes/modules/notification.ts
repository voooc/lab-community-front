export const notification = {
    path: '/notification',
    name: 'notification',
    redirect: '/notification/system',
    meta: {
        title: '通知',
    },
    children: [
        {
            path: 'system',
            name: 'notification-system',
            component: () => import('@/views/notification/system/index.vue'),
            meta: {
                title: '系统消息',
            },
        },
        {
            path: 'follow',
            name: 'notification-follow',
            component: () => import('@/views/notification/follow/index.vue'),
            meta: {
                title: '新增粉丝',
            },
        },
        {
            path: 'comment',
            name: 'notification-comment',
            component: () => import('@/views/notification/comment/index.vue'),
            meta: {
                title: '评论',
            },
        },
        {
            path: 'like',
            name: 'notification-like',
            component: () => import('@/views/notification/like/index.vue'),
            meta: {
                title: '点赞',
            },
        },
    ],
};

export default notification;
