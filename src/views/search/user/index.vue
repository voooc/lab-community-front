<template>
    <div class="result-list">
        <div class="content middle">
            <Skeleton :loading="data.loading">
                <ul class="list tag-list" ref="list" v-if="showList.length">
                    <li v-for="(item, index) in showList" :key="item.id" class="item h-90px">
                        <div class="user">
                            <div class="link">
                                <router-link
                                    :to="{
                                        name: 'user-center',
                                        params: { id: item['id'] },
                                    }"
                                    class="username"
                                    ><img class="avatar" :src="item['image']"
                                /></router-link>
                                <div class="info-box">
                                    <router-link
                                        :to="{
                                            name: 'user-center',
                                            params: { id: item['id'] },
                                        }"
                                        class="username"
                                        ><span class="name">{{
                                            item['username']
                                        }}</span></router-link
                                    >
                                    <div class="detail">{{ item['desc'] }}</div>
                                </div>
                                <a-button
                                    :class="item['user_interface']['is_follow'] ? 'active' : ''"
                                    class="follow-btn"
                                    v-if="userInfo.id != item['id'] && item.user_interface"
                                    @click="
                                        handleFollow(
                                            item.user_interface.is_follow ? 'unfollow' : 'follow',
                                            item['id'],
                                            index,
                                        )
                                    "
                                    >{{
                                        item.user_interface.is_follow ? '已关注' : '关注'
                                    }}</a-button
                                >
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-else class="items-center flex justify-center h-300px">
                    <a-empty />
                </div>
            </Skeleton>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { onMounted, ref, reactive, onUnmounted, computed } from 'vue';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import { Skeleton } from 'ant-design-vue';
    import { getUserAll, postUserFollow } from '@/api/sys/user';
    import { UserInfo, UserResultModel } from '@/models/user/user';
    import { useRoute } from 'vue-router';
    const showList = computed(() => {
        return data.articleInfoList.slice(data.start, data.end);
    });
    const route = useRoute();
    const getArticle = async () => {
        data.loading = true;
        const res: UserResultModel = await getUserAll({
            page: data.page,
            pageSize: data.pageSize,
            search: route.query.query,
        });
        // // 防抖处理，防止数据加载过快，骨架一闪而过影响效果
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                data.loading = false;
                resolve('');
            }, 500);
        });
        promise.then(() => {
            data.articleInfoList.push(...res.items);
            data.next = res.next ? true : false;
        });
    };
    const userStore = useUserStoreWithOut();
    const userInfo = computed(() => {
        const {
            username = '',
            image,
            id,
        } = userStore.getUserInfo || {
            username: null,
            image: null,
            id: null,
        };
        return { username, image, id };
    });
    const handleFollow = async (type: string, id: string | number, num: number) => {
        const res = await postUserFollow({ follow: id, type: type });
        data[num]['user_interface']['is_folow'] = res.follow_active;
    };
    interface DataModel {
        loading: boolean;
        articleInfoList: Array<UserInfo>;
        page: number;
        pageSize: number;
        itemHeight: number;
        showNum: number;
        start: number;
        end: number;
        next: boolean;
    }
    const data = reactive<DataModel>({
        loading: true,
        articleInfoList: [],
        page: 1, // 当前页
        pageSize: 20, // 每页记录数
        itemHeight: 139, //每一列的高度
        showNum: 10, //显示几条数据
        start: 0, //滚动过程显示的开始索引
        end: 10, //滚动过程显示的结束索引
        next: true,
    });
    function lasyLoading(e) {
        let scrollTop = e.target.scrollTop || document.body.scrollTop;
        let clientHeight = e.target.clientHeight;
        let scrollHeight = e.target.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
            if (data.next) {
                data.page++;
                getArticle();
            }
        }
        scrollListener(scrollTop);
    }
    const scrollBar = ref();
    const list = ref();
    function scrollListener(scrollTop) {
        if (scrollBar.value) {
            //计算总的数据需要的高度，构造滚动条高度
            scrollBar.value.style.height = data.itemHeight * data.articleInfoList.length + 'px';
            //开始的数组索引
            let first = Math.floor(scrollTop / data.itemHeight) - 1;
            data.start = first < 0 ? 0 : first;
            //结束索引
            data.end = data.start + data.showNum;
            //计算上滚动区域的高度
            list.value.style.marginTop = data.start * data.itemHeight + 'px';
        }
    }
    onMounted(async () => {
        getArticle();
        window.addEventListener('scroll', lasyLoading, true);
    });
    onUnmounted(() => {
        window.removeEventListener('scroll', lasyLoading);
    });
</script>
<style lang="less" scoped>
    .result-list {
        max-width: 750px;
        width: 100%;
        margin: 70px auto 0px;
        background-color: #fff;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

        .content {
            background-color: #fff;
        }
    }

    .tag-list {
        width: 100%;
        background-color: #fff;
        position: relative;

        .item {
            list-style-type: none;

            &:not(:last-child) {
                border-bottom: 1px solid rgba(230, 230, 231, 0.5);
            }

            .user {
                position: relative;

                .link {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    min-height: 84px;
                    padding: 6px 28px;

                    .avatar {
                        flex: 0 0 auto;
                        margin-right: 20px;
                        width: 44px;
                        border-radius: 50%;
                        display: inline-block;
                        position: relative;
                        background-position: 50%;
                        background-size: cover;
                        background-repeat: no-repeat;
                        object-fit: cover;
                    }

                    .info-box {
                        flex: 1 1 auto;
                        min-width: 0;

                        .username {
                            font-size: 16px;
                            font-weight: 600;
                            color: #2e3155;

                            .name {
                                max-width: 128px;
                                display: inline-block;
                                vertical-align: top;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }

                        .detail {
                            margin-top: 8px;
                            font-size: 12px;
                            font-weight: 500;
                            color: #b9c0c8;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }

                    .follow-btn {
                        flex: 0 0 auto;
                        margin: 0 0 0 12px;
                        font-size: 12px;
                        background-color: #fff;
                        border-radius: 4px;
                        border: 1px solid #92c452;
                        color: #92c452;

                        &.active {
                            background-color: #92c452;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
</style>
