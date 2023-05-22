<!--大图全屏展示组件-->
<template>
    hshsushsuh
    <div class="wrapper" v-if="props.imageList.length">
        <div
            class="content"
            @click="toggleZoomImage"
            :class="{ zoomable: data.isCurrentImgLong, zoomed: data.isInZoomState }"
        >
            <img
                class="img"
                ref="img"
                v-show="data.currentImageLoaded"
                :src="props.imageList[data.innerImageIndex]"
            />
            <!--loading图-->
            <div class="loading-img" v-show="!data.currentImageLoaded">
                <a-spin :spinning="!data.currentImageLoaded" />
            </div>
        </div>
        <!--关闭按钮-->
        <div class="close-btn" @click="close" v-show="!data.isInZoomState"> </div>
        <!--下一张图的按钮-->
        <div
            class="next-btn"
            @click="handleSwitchImage(1)"
            v-show="!data.isInZoomState && data.innerImageIndex < props.imageList.length - 1"
        >
            <Icon icon="material-symbols:chevron-right" class="icon" />
        </div>
        <!--上一张图的按钮-->
        <div
            class="prev-btn"
            @click="handleSwitchImage(-1)"
            v-show="!data.isInZoomState && data.innerImageIndex !== 0"
        >
            <Icon icon="material-symbols:chevron-left" class="icon" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { Icon } from '@/components/Icon';
    import { onMounted, onUnmounted, reactive, ref, watch, nextTick } from 'vue';
    const props = defineProps({
        imageList: {
            type: Object as PropType<string[]>,
            required: true,
        },
        currentImageIndex: {
            type: Number,
            default: 0,
        },
    });
    const img = ref();
    watch(
        () => props.currentImageIndex,
        (newValue) => {
            nextTick(() => {
                if (newValue && img.value) {
                    data.innerImageIndex = newValue;
                    data.currentImg = img.value;
                    if (data.currentImg) {
                        //@ts-ignore
                        data.currentImg.onload = function () {
                            data.currentImageLoaded = true;
                            //计算是不是长图
                            //@ts-ignore
                            let ratio =
                                data.currentImg.naturalHeight / data.currentImg.naturalWidth;
                            if (ratio > data.longImageRatio) {
                                data.isCurrentImgLong = true;
                            }
                        };
                        // data.currentImageLoaded = true;
                    }
                }
            });
        },
        { immediate: true },
    );
    const data = reactive({
        //当前图片是否加载完成
        currentImageLoaded: false,
        //当前图片
        currentImg: null,
        //当前图片是不是长图
        isCurrentImgLong: false,
        //图片为长图的阈值
        longImageRatio: 1.8,
        //是否处于图片zoom的状态
        isInZoomState: false,
        //组件内的当前图片index
        innerImageIndex: 0,
    });
    const emit = defineEmits(['close']);
    //切换大图缩放
    function toggleZoomImage() {
        data.isInZoomState = !data.isInZoomState;
        emit('close');
    }
    //处理图片切换,dir为1是下一张，-1是上一张
    function handleSwitchImage(dir) {
        let len = props.imageList.length;
        if (dir === 1) {
            //下一张
            if (data.innerImageIndex === len - 1) {
                return;
            }
            data.innerImageIndex = data.innerImageIndex + 1;
        } else {
            //上一张
            if (data.innerImageIndex === 0) {
                return;
            }
            data.innerImageIndex = data.innerImageIndex - 1;
        }
    }
    function close() {
        emit('close');
    }
    onMounted(() => {
        document.body.setAttribute('style', 'overflow:hidden;');
    });
    onUnmounted(() => {
        document.body.removeAttribute('style');
    });
</script>

<style scoped lang="less">
    .wrapper {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 10000;

        .zoomable {
            cursor: zoom-in;
        }
        /*放大状态下max-height设置为inherit使得图片的高度不受限制*/
        .zoomed {
            overflow: auto;

            .img {
                max-height: inherit !important;
            }
        }

        .content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: #222;
            display: flex;
            justify-content: center;
            align-items: center;

            .img {
                max-width: 100vw;
                max-height: 100vh;
            }

            .loading-img {
                position: absolute;
            }
        }

        .close-btn {
            position: absolute;
            right: 20px;
            top: 20px;
            height: 40px;
            width: 40px;
            background-color: hsla(0, 0%, 59%, 0.5);
            border-radius: 50%;
            transition: all 0.2s;
            cursor: pointer;
            line-height: 40px;
            color: #fff;
            text-align: center;
            transform: rotate(45deg);

            &:hover {
                background-color: hsla(0, 0%, 80%, 0.5);
                transform: rotate(135deg);
            }

            &:after,
            &:before {
                content: '';
                width: 2px;
                height: 20px;
                display: block;
                background-color: #fff;
                position: absolute;
                left: 50%;
                top: 50%;
            }

            &:after {
                transform: translate(-50%, -50%);
            }

            &:before {
                transform: translate(-50%, -50%) rotate(90deg);
            }
        }

        .next-btn,
        .prev-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 56px;
            height: 56px;
            line-height: 56px;
            text-align: center;
            background-color: hsla(0, 0%, 41%, 0.5);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                background-color: hsla(0, 0%, 67%, 0.5);
            }

            .icon {
                color: #fff;
                font-size: 27px !important;
                height: 100%;
                align-items: center;
            }
        }

        .prev-btn {
            left: 20px;
        }

        .next-btn {
            right: 20px;
        }
    }
</style>
