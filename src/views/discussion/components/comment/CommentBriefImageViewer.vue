<!--新鲜事评论的回复图片预览框-->
<template>
    <div class="wrapper">
        <div
            class="img-inner-box"
            @click="showDetailImage"
            :style="{ backgroundImage: 'url(' + props.imgSrc + ')' }"
        >
        </div>
        <!--三角形箭头-->
        <div class="triangle"> </div>
        <!--透明的连接桥，防止鼠标移出隐藏图片预览框-->
        <div class="transparent"> </div>
    </div>
</template>
<script setup lang="ts">
    const props = defineProps({
        imgSrc: {
            type: String,
            default: '',
        },
    });
    const emit = defineEmits(['show']);
    function showDetailImage() {
        emit('show');
    }
</script>
<style scoped lang="less">
    .wrapper {
        background-color: #fff;
        padding: 8px;
        border-radius: 2px;
        box-shadow: 0 5px 18px 0 rgba(0, 0, 0, 0.16);
        border: 0.5px solid hsla(0, 0%, 59%, 0.2);
        position: absolute;
        top: 2em;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;

        .img-inner-box {
            width: 200px;
            min-height: 170px;
            background-position: 50%;
            background-color: #fff;
            background-repeat: no-repeat;
            background-size: cover;
        }

        .triangle {
            position: absolute;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            top: -5px;
            background-color: #fff;
            border-left: 0.5px solid hsla(0, 0%, 59%, 0.2);
            border-top: 0.5px solid hsla(0, 0%, 59%, 0.2);
            width: 10px;
            height: 10px;
        }

        .transparent {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 20px;
            top: -20px;
            background-color: transparent;
        }
    }
</style>
