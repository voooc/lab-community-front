<template>
    <div>
        <TitleImage />
        <div style="background-color: #fff">
            <div class="container py-25px">
                <div class="content">
                    <div class="about flex justify-between pb-25px">
                        <div class="info w-600px">
                            <h2>实验室概况</h2>
                            <p>
                                value
                                data实验室是一个致力于大数据研究和创新的学术实验室。实验室提供一个学习和研究平台，旨在培养学生在大数据领域的专业知识和实践能力。实验室由一支充满激情和经验丰富的教师团队带领。
                                在实验室中，学生们有机会参与各种大数据比赛和挑战，这些比赛涵盖了数据挖掘、机器学习、数据可视化等多个方面。通过参与比赛，学生们可以应用所学知识，锻炼解决实际问题的能力，并与其他团队进行交流和竞争。实验室的老师会提供指导和支持，帮助学生们克服困难，提升竞赛表现。
                                除了比赛，实验室也鼓励学生自主研究和管理，提供一个开放和创新的环境。学生们可以自由选择感兴趣的课题进行研究，并与其他同学进行合作。实验室提供了先进的计算设备和数据资源，为学生们的研究提供支持。同时，实验室也鼓励学生们积极参与学术交流和分享，组织讨论会和研讨会，促进知识的共享和合作。
                                欢迎加入value data实验室，与我们一起探索大数据世界的无限可能！
                            </p>
                        </div>
                        <div class="image">
                            <img src="@/assets/images/overview.png" />
                        </div>
                    </div>
                    <div class="sub-page"></div>
                    <div class="target">
                        <div class="title">
                            <div style="font-weight: normal; font-size: 36px">研究方向</div>
                            <div style="font-size: 18px; color: #999999; text-transform: uppercase">
                                Research directions
                            </div>
                        </div>
                        <div class="content my-25px">
                            <div class="grid grid-cols-3 gap-5">
                                <div
                                    v-for="(item, index) in content"
                                    :key="index"
                                    class="item p-25px"
                                >
                                    <div class="box flex">
                                        <div class="icon w-70px">
                                            <Icon
                                                :icon="item.icon"
                                                :style="{ fontSize: '40px', color: item.color }"
                                            />
                                        </div>
                                        <div class="flex-1 text-left">
                                            <div
                                                class="title mb-20px"
                                                style="color: rgb(76, 76, 76); font-size: 18px"
                                            >
                                                {{ item.title }}
                                            </div>
                                            <p>{{ item.p }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="target">
                        <div class="title">
                            <div style="font-weight: normal; font-size: 36px">实验室环境</div>
                            <div style="font-size: 18px; color: #999999; text-transform: uppercase">
                                LAB ENVIROMENT
                            </div>
                        </div>
                        <div class="content my-25px">
                            <LazyContainer>
                                <div class="grid w-full h-full grid-cols-3 gap-5">
                                    <a-image-preview-group>
                                        <a-image
                                            v-for="item in imageList"
                                            :src="item"
                                            :key="item"
                                            class="!h-300px"
                                            style="object-fit: cover"
                                        />
                                    </a-image-preview-group>
                                </div>

                                <template #skeleton>
                                    <Skeleton :rows="10" />
                                </template>
                            </LazyContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import TitleImage from '../layout/index.vue';
    import Icon from '@/components/Icon';
    import { LazyContainer } from '@/components/Container/index';
    import { Skeleton } from 'ant-design-vue';
    import List1 from '@/assets/images/enviroment/1.jpeg';
    import List2 from '@/assets/images/enviroment/2.jpeg';
    import List3 from '@/assets/images/enviroment/3.jpg';
    const imageList = [List1, List2, List3];
    const content = [
        {
            icon: 'carbon:chart-line-data',
            title: '数据挖掘',
            p: '数据挖掘通过统计、在线分析处理和模式识别等诸多方法来实现上述目标',
            color: '#86c1e5',
        },
        {
            icon: 'material-symbols:speech-to-text',
            title: '自然语言处理',
            p: '自然语言处理研究能实现人与计算机之间用自然语言进行有效通信的各种理论和方法。',
            color: '#24cfc6',
        },
        {
            icon: 'ic:outline-image',
            title: '数字图像处理',
            p: '通过计算机对数字图像进行去除噪声，增强，复原，分割，提取特征等处理的方法和技术',
            color: '#53ca90',
        },
    ];
</script>
<style lang="less" scoped>
    .container {
        margin: 0 auto;
        text-align: center;

        .content {
            .about {
                .info {
                    text-align: left;

                    h2 {
                        height: 50px;
                        line-height: 50px;
                        font-size: 36px;
                        color: #1a1a1a;
                        background: url(@/assets/images/aboutbg.png) right center no-repeat;
                        margin-bottom: 50px;
                        width: 400px;
                    }

                    p {
                        color: #666666;
                        font-size: 16px;
                    }
                }
            }

            .target {
                .content {
                    .item {
                        box-shadow: 0px 0px 20px #ddd;
                        transition: all 0.2s linear;
                        -webkit-transition: all 0.2s linear;

                        &:hover {
                            background: #eee;
                            margin-top: -10px;
                            box-shadow: 0 0 20px #fff;
                        }

                        p {
                            color: #999999;
                            overflow: hidden;
                            word-break: normal;
                            text-align: justify;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                        }
                    }
                }
            }
        }
    }
</style>
