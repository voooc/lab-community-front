<!--评论中的全屏图片查看组件-->
<template>
    <div class="comment-image-viewer-wrapper" @click="close">
        <img :src="props.imgSrc" v-if="!imgLoaded" class="image" />
        <a-spin v-else />
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, onUnmounted, ref, watch } from 'vue';

    const props = defineProps({
        imgSrc: {
            type: String,
            default: '',
        },
    });
    const imgLoaded = ref(true);
    watch(
        () => props.imgSrc,
        (newValue) => {
            if (newValue) {
                imgLoaded.value = false;
            }
        },
        { immediate: true },
    );
    const emit = defineEmits(['close']);
    function close() {
        emit('close');
    }
    onMounted(() => {
        window.addEventListener('scroll', close);
    });
    onUnmounted(() => {
        window.removeEventListener('scroll', close);
    });
</script>

<style scoped lang="less">
    .comment-image-viewer-wrapper {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
