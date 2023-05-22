<template>
    <div
        class="relative banner h-450px"
        :style="{ background: `url('${aboutImage}') center center no-repeat` }"
    >
        <div class="absolute desc">
            <h2>关于我们</h2>
            <p>建设一流实验室</p>
        </div>
    </div>
</template>
<script setup lang="ts">
    import aboutImage from '@/assets/images/about.jpg';
</script>
<style lang="less" scoped>
    .banner {
        .desc {
            top: 40%;
            left: 5%;
            color: #fff;

            h2 {
                font-size: 28px;
                font-weight: normal;
                color: #fff;
                line-height: 60px;
            }

            p {
                font-size: 18px;
            }
        }
    }
</style>
