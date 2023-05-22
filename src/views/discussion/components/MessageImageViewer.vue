<template>
    <div class="wrapper" ref="wrapper" v-if="props.imageList.length">
        <!--缩略图的div-->
        <div class="brief-view-wrapper" v-show="!data.isShowDetail" ref="outerWrapper">
            <!--如果是单张图-->
            <template v-if="isSingleImage">
                <div
                    class="single-img-container"
                    @click="showDetailImage(props.imageList[0])"
                    :style="{ backgroundImage: 'url(' + props.imageList[0] + ')' }"
                >
                    <!--用div撑开图片-->
                    <div class="ratio-holder" :style="{ paddingTop: calcSingleImgHeight }"> </div>
                    <span class="long-image" v-if="data.isLongImage">长图</span>
                </div>
            </template>
            <!--多张图-->
            <template v-else>
                <!--图片放在backgroundImage属性中-->
                <div class="multiple-img-wrapper" :class="[colsOfMultipleImages]">
                    <div
                        class="multiple-img-container"
                        v-for="(item, index) in props.imageList"
                        @click="showDetailImage(item)"
                        :key="index"
                        :style="{ backgroundImage: 'url(' + item + ')' }"
                    >
                        <!--控制图片的高度和宽度一样，padding-top基于父元素的宽度-->
                        <div class="ratio-holder" style="padding-top: 100%"> </div>
                        <span class="long-image" v-show="data.isLongImageList[index]">长图</span>
                    </div>
                </div>
            </template>
        </div>
        <!--详情图的div-->
        <div class="detail-view-wrapper" v-show="data.isShowDetail" ref="detailViewWrapper">
            <!--顶部操作栏-->
            <div class="top-panel">
                <div class="panel-item" @click="hideDetailImage">
                    <Icon icon="fad:zoomout" />
                    <span>收起</span>
                </div>
                <div class="panel-item" @click="showFullScreenViewer">
                    <Icon icon="fad:zoomin" />
                    <span>查看大图</span>
                </div>
                <div class="panel-item" @click="handleImageRotate(-1)">
                    <Icon icon="simple-line-icons:reload" />
                    <span>向左旋转</span>
                </div>
                <div class="panel-item" @click="handleImageRotate(1)">
                    <Icon icon="ant-design:reload-outlined" />
                    <span>向右旋转</span>
                </div>
            </div>
            <!--中间图片展示栏,注意需要设置高度，因为里面的img是绝对定位-->
            <div class="detail-img-wrapper" :style="{ height: outerDivHeight + 'px' }">
                <!--加载的logo-->
                <div class="detail-img-loading">
                    <a-spin :spinning="!data.isDetailImageLoaded" />
                </div>
                <img
                    src=""
                    ref="detailImage"
                    v-show="data.isDetailImageLoaded"
                    :style="detailImageStyle"
                    class="detail-img"
                />
                <!--点击隐藏详情图的div-->
                <div class="toggle-zoomout" @click="hideDetailImage"> </div>
                <!--上一张图片的div-->
                <div
                    class="prev-img"
                    @click="switchImage(-1)"
                    v-if="data.currentImageIndex > 0"
                ></div>
                <div
                    class="next-img"
                    @click="switchImage(1)"
                    v-if="data.currentImageIndex < props.imageList.length - 1"
                >
                </div>
                <!--全屏大图组件-->
                <full-screen-viewer
                    :imageList="props.imageList"
                    :currentImageIndex="data.currentImageIndex"
                    @close="handleFullScreenViewerClose"
                    v-if="data.isShowFullScreenViewer"
                />
            </div>
            <!--缩略图展示栏-->
            <div class="small-img-wrapper">
                <div
                    class="small-img-container"
                    @click="switchSmallImage(index)"
                    :class="{ 'small-img-active': data.currentImageIndex === index }"
                    :style="{ backgroundImage: 'url(' + item + ')' }"
                    v-for="(item, index) in props.imageList"
                    :key="index"
                >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Icon from '@/components/Icon';
    import FullScreenViewer from './DetailImageFullScreenViewer.vue';
    import { computed, reactive, ref, watch } from 'vue';
    const props = defineProps({
        imageList: {
            type: Object as PropType<string[]>,
            default: () => {
                return [];
            },
        },
    });
    const data = reactive({
        // 是否显示详情图组件
        isShowDetail: false,
        //图片为长图的极限值
        longImageLimitRatio: 1.8,
        //图片高/宽比最小值
        imageMinHeightRatio: 0.68,
        //图片高/宽比最大值
        imageMaxHeightRatio: 1.45,
        //单图的原始尺寸
        singleImageNaturalWidth: 0,
        singleImageNaturalHeight: 0,
        //单图是否是长图
        isLongImage: false,
        //多图情况下是否是长图的数组
        isLongImageList: [],

        /* 大图数据结构 */
        //大图加载时的默认高度px
        loadingDefaultHeight: 320,
        //大图是否加载完成
        isDetailImageLoaded: false,
        //大图的原始尺寸
        detailImageNaturalWidth: 0,
        detailImageNaturalHeight: 0,
        //大图的旋转角度
        detailRotateAngel: 0,
        //大图的translate的x值和y值
        detailImageTranslateX: '-50%',
        detailImageTranslateY: '0',
        //旋转情况下大图的translate的可能值数组,从左向右是顺时针旋转
        detailImageTranslateArray: [
            ['-50%', '0'],
            ['0', '-50%'],
            ['-50%', '-100%'],
            ['-100%', '-50%'],
        ],
        //是否展示大图全屏组件
        isShowFullScreenViewer: false,
        //大图全屏组件的当前图片的index
        currentImageIndex: 0,
    });
    const detailImageStyle = computed(() => {
        return {
            width: detailImageWidth.value + 'px',
            height: detailImageHeight.value + 'px',
            //注意顺序:先移动再旋转
            transform:
                'rotate(' +
                data.detailRotateAngel +
                'deg)' +
                ' ' +
                'translate(' +
                data.detailImageTranslateX +
                ',' +
                data.detailImageTranslateY +
                ')',
        };
    });
    const outerDivHeight = computed(() => {
        //根据旋转角度来计算该图是初始状态还是旋转过90度横竖交换的情况
        let angel = data.detailRotateAngel;
        if (angel === 90 || angel === 270 || angel === -90 || angel === -270) {
            //由初始状态旋转一次的情况
            return detailImageWidth.value;
        } else {
            //初始状态
            return detailImageHeight.value;
        }
    });
    const wrapper = ref();
    const outerWrapper = ref();
    const detailViewWrapper = ref();
    const detailImage = ref();
    //图片旋转时重新计算详情图片的宽高
    function processImageScaleInRotate() {
        let nw = data.detailImageNaturalWidth,
            nh = data.detailImageNaturalHeight;
        //根据旋转角度来计算该图是初始状态还是旋转过90度横竖交换的情况
        let angel = data.detailRotateAngel;
        //图片旋转后的宽高
        let imageRotatedWidth, imageRotatedHeight;
        let clientWidth = wrapper.value.clientWidth;
        let ratio = nh / nw;
        //是否是初始状态
        let isInitialState = true;
        if (angel === 90 || angel === 270 || angel === -90 || angel === -270) {
            isInitialState = false;
            //由初始状态旋转一次的情况
            if (nh > clientWidth) {
                imageRotatedWidth = clientWidth;
                imageRotatedHeight = imageRotatedWidth / ratio;
            } else {
                imageRotatedWidth = nh;
                imageRotatedHeight = imageRotatedWidth / ratio;
            }
        } else {
            //旋转一次变为初始状态的情况
            isInitialState = true;
            if (nw > clientWidth) {
                imageRotatedWidth = clientWidth;
                imageRotatedHeight = imageRotatedWidth * ratio;
            } else {
                imageRotatedWidth = nw;
                imageRotatedHeight = imageRotatedWidth * ratio;
            }
        }
        //注意这里的判断,width和height在旋转状态下容易弄反
        return {
            width: isInitialState ? imageRotatedWidth : imageRotatedHeight,
            height: isInitialState ? imageRotatedHeight : imageRotatedWidth,
        };
    }
    //单张图的高度计算
    const calcSingleImgHeight = computed(() => {
        const image = new Image();
        image.onload = function () {
            data.singleImageNaturalWidth = image.naturalWidth;
            data.singleImageNaturalHeight = image.naturalHeight;
        };
        image.src = props.imageList[0];
        let ratio = data.singleImageNaturalWidth
            ? data.singleImageNaturalHeight / data.singleImageNaturalWidth
            : 1;
        if (ratio < data.imageMinHeightRatio) {
            ratio = data.imageMinHeightRatio;
        }
        if (ratio > data.imageMaxHeightRatio) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            data.isLongImage = true;
            ratio = data.imageMaxHeightRatio;
        }
        return ratio * 100 + '%';
    });
    //是否是单张图
    const isSingleImage = computed(() => {
        return !(props.imageList.length > 1);
    });
    //多图时显示的列数的类
    const colsOfMultipleImages = computed(() => {
        let len = props.imageList.length;
        const map = {
            1: 'col-4',
            2: 'col-4',
            3: 'col-4',
            4: 'col-4',
            5: 'col-3',
            6: 'col-3',
            7: 'col-4',
            8: 'col-4',
            9: 'col-3',
        };
        return len === 0 ? '' : map[len];
    });
    //详情大图的宽度
    const detailImageWidth = computed(() => {
        if (!data.isDetailImageLoaded) {
            return wrapper.value ? wrapper.value.clientWidth : 1;
        } else {
            return processImageScaleInRotate().width;
        }
    });
    //详情大图的高度
    const detailImageHeight = computed(() => {
        if (!data.isDetailImageLoaded) {
            return data.loadingDefaultHeight;
        } else {
            return processImageScaleInRotate().height;
        }
    });
    //下方缩略图的图片切换
    function switchSmallImage(index) {
        data.currentImageIndex = index;
        showDetailImage(props.imageList[index]);
        resetDetailImageParams();
    }
    //详情图的图片前后切换
    function switchImage(dir) {
        if (dir === 1) {
            //下一张
            let nextIndex = data.currentImageIndex + 1;
            if (nextIndex === props.imageList.length) {
                return;
            }
            data.currentImageIndex = nextIndex;
            showDetailImage(props.imageList[nextIndex]);
        } else {
            //上一张
            let prevIndex = data.currentImageIndex - 1;
            if (prevIndex === -1) {
                return;
            }
            data.currentImageIndex = prevIndex;
            showDetailImage(props.imageList[prevIndex]);
        }
        //重置参数
        resetDetailImageParams();
    }
    //关闭全屏大图组件
    function handleFullScreenViewerClose() {
        data.isShowFullScreenViewer = false;
    }
    //显示全屏大图组件
    function showFullScreenViewer() {
        if (!data.isDetailImageLoaded) return;
        data.isShowFullScreenViewer = true;
    }
    //计算每张图是否是长图
    function calcImageIsLongImage() {
        props.imageList.forEach((item, index) => {
            const image = new Image();
            image.onload = function () {
                let ratio = image.naturalHeight / image.naturalWidth;
                if (ratio > data.longImageLimitRatio) {
                    //@ts-ignore
                    data.isLongImageList[index] = true;
                }
            };
            image.src = item;
        });
    }
    watch(
        () => props.imageList,
        (newValue) => {
            // 在数据获取之后给其他内容赋值
            if (!newValue) return;
            //初始化是否是长图的数组
            //@ts-ignore
            data.isLongImageList = Array(props.imageList.length).fill(false);
            calcImageIsLongImage();
        },
    );
    //展示详情大图
    function showDetailImage(imgUrl) {
        //设置index
        data.currentImageIndex = props.imageList.indexOf(imgUrl);
        //改变状态为大图加载中
        data.isDetailImageLoaded = false;
        //计算大图的原始尺寸
        let image = detailImage.value;
        image.onload = function () {
            data.isDetailImageLoaded = true;
            data.detailImageNaturalWidth = image.naturalWidth;
            data.detailImageNaturalHeight = image.naturalHeight;
        };
        // data.isDetailImageLoaded = false;
        image.src = imgUrl;
        data.isShowDetail = true;
    }
    //处理图片旋转
    function handleImageRotate(dir) {
        //图片加载完成才能旋转
        if (!data.isDetailImageLoaded) return;
        // 注意旋转中心是图片的左上角(transform-origin:top left)
        let angleDelta = dir === 1 ? 90 : -90;
        //向右顺时针旋转
        data.detailRotateAngel = (data.detailRotateAngel + angleDelta) % 360;
        //修正translate的值
        let currentIndex;
        data.detailImageTranslateArray.forEach((item, index) => {
            //找到当前的tranlate值
            if (item[0] === data.detailImageTranslateX && item[1] === data.detailImageTranslateY) {
                currentIndex = index;
            }
        });
        //取下一个值
        let nextIndex = currentIndex + dir;
        if (nextIndex === data.detailImageTranslateArray.length) {
            nextIndex = 0;
        } else if (nextIndex === -1) {
            nextIndex = data.detailImageTranslateArray.length - 1;
        }
        //更新tranlate的值
        data.detailImageTranslateX = data.detailImageTranslateArray[nextIndex][0];
        data.detailImageTranslateY = data.detailImageTranslateArray[nextIndex][1];

        //修正外层div的高度
        processImageScaleInRotate();
    }
    //隐藏详情大图
    function hideDetailImage() {
        resetDetailImageParams();
        data.isShowDetail = false;
    }
    //重置详情图的参数
    function resetDetailImageParams() {
        //旋转角度重置为0
        data.detailRotateAngel = 0;
        //重置translate
        data.detailImageTranslateX = '-50%';
        data.detailImageTranslateY = '0';
        data.isDetailImageLoaded = false;
    }
</script>

<style scoped lang="less">
    .wrapper {
        width: 100%;
        box-shadow: none;

        .brief-view-wrapper {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            /*未设置高度*/
            .multiple-img-wrapper {
                display: flex;
                flex-wrap: wrap;

                .multiple-img-container {
                    width: 110px;
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 4px;
                    margin-right: 4px;
                    position: relative;
                    background-repeat: no-repeat;
                    background-position: 50%;
                    background-size: cover;
                    background-color: #d7d8da;
                    cursor: zoom-in;
                }
            }

            .long-image {
                position: absolute;
                right: 10px;
                bottom: 10px;
                padding: 3px 6px;
                font-size: 12px;
                color: #fff;
                background-color: rgba(0, 0, 0, 0.49);
                border: 1px solid #fff;
                border-radius: 2px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            .col-3 {
                width: 75%;
            }

            .col-4 {
                width: 100%;
            }

            .single-img-container {
                width: 200px;
                display: flex;
                flex-wrap: wrap;
                margin-top: 4px;
                margin-right: 4px;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: cover;
                cursor: zoom-in;
                position: relative;
                background-color: #d7d8da;
            }
        }

        .detail-view-wrapper {
            width: 100%;

            .top-panel {
                height: 32px;
                background-color: #f4f5f7;
                user-select: none;

                .panel-item {
                    line-height: 32px;
                    display: inline-block;
                    padding: 0 12px;
                    font-size: 13px;
                    color: #76797e;
                    cursor: pointer;

                    &:hover {
                        color: #027fff;
                    }

                    .icon-pos {
                        position: relative;
                        top: 1px;
                    }
                }
            }

            .detail-img-wrapper {
                position: relative;
                background-color: #f4f5f7;
                width: 100%;
                /*高度渐变的动画效果,必须加overflow:hidden*/
                transition: height 0.2s ease;
                overflow: hidden;

                .detail-img-loading {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                .detail-img {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    transform-origin: top left;
                }

                .toggle-zoomout {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    cursor: zoom-out;
                }

                .prev-img {
                    position: absolute;
                    left: 0;
                    width: 30%;
                    top: 0;
                    height: 100%;
                    cursor: pointer;
                }

                .next-img {
                    position: absolute;
                    right: 0;
                    width: 30%;
                    top: 0;
                    height: 100%;
                    cursor: pointer;
                }
            }

            .small-img-wrapper {
                margin-top: 8px;

                .small-img-active {
                    opacity: 1 !important;
                    border: 2px solid #027fff !important;
                }

                .small-img-container {
                    width: 10%;
                    display: inline-block;
                    background-position: 50% 50%;
                    background-repeat: no-repeat;
                    background-size: cover;
                    border: 2px solid transparent;
                    box-sizing: border-box;
                    opacity: 0.6;
                    cursor: pointer;
                    transition: all 0.2s;

                    &:after {
                        content: '';
                        display: block;
                        padding-top: 100%;
                    }

                    &:not(:last-child) {
                        margin-right: 1%;
                    }

                    &:hover {
                        opacity: 1;
                        border: 2px solid #027fff;
                    }
                }
            }
        }
    }
</style>
