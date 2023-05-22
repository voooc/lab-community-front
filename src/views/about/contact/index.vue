<template>
    <div>
        <TitleImage />
        <div style="background-color: #fff">
            <div class="container">
                <div class="title">
                    <div style="font-weight: normal; font-size: 36px">联系我们</div>
                </div>
                <div class="content h-400px pb-60px relative">
                    <div ref="wrapRef" class="w-full h-full"></div>
                    <div
                        class="absolute"
                        style="top: 50%; transform: translate(0, -50%); left: 10px; opacity: 0.8"
                    >
                        <a-card title="value data实验室" style="width: 300px; background: #1890ff">
                            <p>地址：重庆市巴南区红光大道69号</p>
                        </a-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { nextTick, onMounted, ref, unref } from 'vue';
    import TitleImage from '../layout/index.vue';
    import { useScript } from '@/hooks/web/useScript';

    const BAI_DU_MAP_URL =
        'https://api.map.baidu.com/getscript?v=3.0&ak=zD5l74hLdu3irsNTXWjKfZD8CRVb1VMb&services=&t=20210201100830&s=1';
    const wrapRef = ref<HTMLDivElement | null>(null);
    const { toPromise } = useScript({ src: BAI_DU_MAP_URL });

    async function initMap() {
        await toPromise();
        await nextTick();
        const wrapEl = unref(wrapRef);
        if (!wrapEl) return;
        const BMap = (window as any).BMap;
        const map = new BMap.Map(wrapEl);
        const point = new BMap.Point(106.53516, 29.46058);
        const mark = new BMap.Marker(new BMap.Point(106.53516, 29.46058));
        // 在坐标点设置点标记
        map.addOverlay(mark);
        // 在点标记上添加数字（根据需求设置对应信息）
        const label = new BMap.Label('value data实验室', {
            //调整数字跟点标记的位置关系
            offset: new BMap.Size(5, -20),
        });
        label.setStyle({
            background: '#fff',
            color: '#000',
            border: '1px solid red',
        });
        //对label的样式进行设置
        mark.setLabel(label);

        map.centerAndZoom(point, 30);
        map.enableScrollWheelZoom(true);
    }
    onMounted(() => {
        initMap();
    });
</script>
<style lang="less" scoped>
    .container {
        margin: 0 auto;
        text-align: center;

        .title {
            padding: 40px 0;
        }
    }
</style>
