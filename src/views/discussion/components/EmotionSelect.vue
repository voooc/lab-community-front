<!--表情选择组件-->
<template>
    <div class="emoji-wrapper">
        <div class="emoji-header flex h-40px">
            <div
                v-for="item in page"
                :key="item.value"
                @click="changePage(item)"
                :class="{ active: item.value === activeIndex }"
                class="emoji-box"
            >
                {{ item.name }}
            </div>
        </div>
        <div class="emoji-content-wrapper">
            <div
                v-for="(emoji, index) of emojis"
                :key="`emoji-${index}`"
                @click="addEmotion(emoji)"
                v-text="emoji"
                class="emotion-btn"
            ></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { smile, gestures } from './data';
    const emit = defineEmits(['choose']);
    const page = ref([
        {
            name: '😀',
            value: 1,
            data: smile,
        },
        {
            name: '🖐',
            value: 2,
            data: gestures,
        },
    ]);
    const activeIndex = ref(1);
    function changePage(temp) {
        activeIndex.value = temp.value;
        emojis.value = temp.data;
    }
    const emojis = ref(page.value[0].data);
    function addEmotion(emotion) {
        emit('choose', emotion);
    }
</script>

<style scoped lang="less">
    .emoji-wrapper {
        width: 100%;
        max-width: 100%;

        .emoji-content-wrapper {
            display: flex;
            flex-wrap: wrap;
            overflow-x: hidden;
            overflow-y: scroll;
            width: 416px;
            height: 270px;

            .emotion-btn {
                position: relative;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;

                &:hover {
                    transform: scale(1.1);
                }
            }
        }

        .emoji-header {
            border-bottom: 1px solid #e5e6eb;
            padding: 0 12px;
            align-items: center;

            .emoji-box {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 48px;
                height: 32px;
                border-radius: 4px;
                transition: background-color 0.2s;
                margin-right: 16px;

                &.active {
                    background-color: #e5e6eb;
                }
            }
        }
    }
</style>
