<template>
    <div class="search-box flex items-center mr-20px">
        <div class="flex relative">
            <a-input-search
                v-model:value="keyword"
                placeholder="input search text"
                style="width: 200px"
                @search="onSearch"
                @focus="showHistory = true"
                @change="handleChange"
                enter-button="搜索"
            />
            <div v-if="showHistory" class="history-list" ref="historyBox">
                <div class="title">
                    <span>搜索历史</span>
                    <span style="color: #1e80ff; cursor: pointer" @click="handleClear">清空</span>
                </div>
                <ul>
                    <li
                        v-for="(item, index) in historyList"
                        :key="index"
                        @click="selectKeyword(item)"
                        >{{ item }}</li
                    >
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ARTICLE_HISTORY_KEY } from '@/enums/cacheEnum';
    import { onMountedOrActivated } from '@/hooks/core/onMountedOrActivated';
    import { createLocalStorage } from '@/utils/cache';
    import { onUnmounted, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    const historyBox = ref();
    const keyword = ref<string>('');
    const historyList = ref<string[]>([]);
    const showHistory = ref(false);
    const ls = createLocalStorage();
    const temp = ls.get(ARTICLE_HISTORY_KEY);
    historyList.value = temp ? JSON.parse(temp) : [];
    function saveHistory(keyword: string) {
        if (!keyword.trim()) return;
        const exist = historyList.value.some((item) => item === keyword);
        if (!exist) {
            historyList.value.unshift(keyword);
        }
    }
    const router = useRouter();
    const onSearch = () => {
        saveHistory(keyword.value);
        router.push({ path: '/search', query: { query: keyword.value } });
    };
    const selectKeyword = (value: string) => {
        keyword.value = value;
        showHistory.value = false;
        onSearch();
    };
    function handleClear() {
        historyList.value = [];
    }
    watch(
        historyList.value,
        (newVal) => {
            ls.set(ARTICLE_HISTORY_KEY, JSON.stringify(newVal));
        },
        { deep: true },
    );
    function handleChange(e) {
        if (e.target.value === '') {
            showHistory.value = true;
        } else {
            showHistory.value = false;
        }
    }
    function clickHandler(e) {
        // 获取点击的元素
        const target = e.target;
        // 判断是否点击了搜索框或者历史记录框以外的区域
        if (!historyBox.value) {
            return;
        }
        if (!historyBox.value.contains(target) && target.className !== 'ant-input') {
            // 点击了其他区域，让历史记录框消失
            showHistory.value = false;
        }
    }
    onMountedOrActivated(() => {
        document.addEventListener('click', clickHandler);
    });
    onUnmounted(() => {
        document.removeEventListener('click', clickHandler);
    });
</script>

<style lang="less" scoped>
    .search-box {
        max-width: 400px;
    }

    .history-list {
        width: 100%;
        position: absolute;
        top: 110%;
        line-height: 24px;
        left: 0;
        z-index: 1000;
        min-width: 72px;
        font-size: 12px;
        color: #869aab;
        list-style: none;
        text-align: left;
        border-radius: 4px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        border: 1px solid #ebebeb;
        background-color: #fff;

        .title {
            border-bottom: 1px solid #ebebeb;
            padding: 6px 12px;
            display: flex;
            justify-content: space-between;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
                padding: 6px 12px;
                cursor: pointer;
                color: #5e6369;
                border-bottom: 1px solid #ddd;

                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }
</style>
