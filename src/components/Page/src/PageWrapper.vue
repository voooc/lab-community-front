<template>
    <div :class="getClass" ref="wrapperRef">
        <div class="title" v-if="title" ref="headerRef">
            <span class="text">{{ title }}</span>
        </div>
        <div
            class="overflow-hidden"
            :class="getContentClass"
            :style="getContentStyle"
            ref="contentRef"
        >
            <slot></slot>
        </div>

        <PageFooter v-if="getShowFooter" ref="footerRef">
            <template #left>
                <slot name="leftFooter"></slot>
            </template>
            <template #right>
                <slot name="rightFooter"></slot>
            </template>
        </PageFooter>
    </div>
</template>
<script lang="ts">
    import { CSSProperties, PropType, provide, unref } from 'vue';

    import { defineComponent, computed, ref } from 'vue';
    import PageFooter from './PageFooter.vue';

    import { propTypes } from '@/utils/propTypes';
    import { omit } from 'lodash-es';
    import { PageWrapperFixedHeightKey } from '..';
    import { useContentHeight } from '@/hooks/web/useContentHeight';

    export default defineComponent({
        name: 'PageWrapper',
        components: { PageFooter },
        inheritAttrs: false,
        props: {
            title: propTypes.string,
            dense: propTypes.bool,
            ghost: propTypes.bool,
            content: propTypes.string,
            contentStyle: {
                type: Object as PropType<CSSProperties>,
            },
            contentBackground: propTypes.bool,
            contentFullHeight: propTypes.bool,
            contentClass: propTypes.string,
            fixedHeight: propTypes.bool,
            upwardSpace: propTypes.oneOfType([propTypes.number, propTypes.string]).def(0),
        },
        setup(props, { slots, attrs }) {
            const wrapperRef = ref(null);
            const headerRef = ref(null);
            const contentRef = ref(null);
            const footerRef = ref(null);
            const prefixCls = 'page-wrapper';

            provide(
                PageWrapperFixedHeightKey,
                computed(() => props.fixedHeight),
            );

            const getClass = computed(() => {
                return [
                    prefixCls,
                    {
                        [`${prefixCls}--dense`]: props.dense,
                    },
                    attrs.class ?? {},
                ];
            });

            const getShowFooter = computed(() => slots?.leftFooter || slots?.rightFooter);

            const getIsContentFullHeight = computed(() => {
                return props.contentFullHeight;
            });

            const getUpwardSpace = computed(() => props.upwardSpace);

            const getHeaderSlots = computed(() => {
                return Object.keys(
                    omit(slots, 'default', 'leftFooter', 'rightFooter', 'headerContent'),
                );
            });

            const { contentHeight } = useContentHeight(
                getIsContentFullHeight,
                wrapperRef,
                [headerRef, footerRef],
                [contentRef],
                getUpwardSpace,
            );

            const getContentStyle = computed((): CSSProperties => {
                const { contentFullHeight, contentStyle, fixedHeight } = props;
                if (!contentFullHeight) {
                    return { ...contentStyle };
                }

                const height = `${unref(contentHeight)}px`;

                return {
                    ...contentStyle,
                    minHeight: height,
                    ...(fixedHeight ? { height } : {}),
                };
            });

            const getContentClass = computed(() => {
                const { contentBackground, contentClass } = props;
                return [
                    `${prefixCls}-content`,
                    contentClass,
                    {
                        [`${prefixCls}-content-bg`]: contentBackground,
                    },
                ];
            });

            return {
                getContentStyle,
                wrapperRef,
                headerRef,
                contentRef,
                footerRef,
                getClass,
                getHeaderSlots,
                prefixCls,
                getShowFooter,
                omit,
                getContentClass,
            };
        },
    });
</script>
<style lang="less">
    @prefix-cls: ~'page-wrapper';

    .@{prefix-cls} {
        position: relative;
        border-radius: 0px;

        .title {
            display: flex;
            color: #4e5969;
            align-items: center;
            font-size: 16px;
            font-weight: 500;
            line-height: 1;
            padding: 20px;
            height: 57px;
            background: #fff;
            position: sticky;
            top: 0;
            z-index: 900;
            border-bottom: 1px solid #f1f1f1;
            box-sizing: border-box;
        }

        &-content {
            padding: 20px;
        }

        &-content-bg {
            background-color: #fff;
        }

        &--dense {
            .@{prefix-cls}-content {
                margin: 0;
            }
        }
    }
</style>
