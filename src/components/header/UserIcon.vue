<template>
    <div class="user">
        <span :class="prefixCls" class="flex">
            <img :class="`${prefixCls}__header`" :src="userInfo.avatar" v-if="userInfo.avatar" />
            <span :class="`${prefixCls}__info hidden md:block`">
                <span :class="`${prefixCls}__name  `" class="truncate">
                    {{ userInfo.username }}
                </span>
            </span>
        </span>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'UserIcon',
    };
</script>

<script lang="ts" setup>
    import { computed } from 'vue';
    import { useUserStore } from '@/store/modules/user';
    import { useDesign } from '@/hooks/web/useDesign';
    const { prefixCls } = useDesign('header-user');
    const userStore = useUserStore();
    const userInfo = computed(() => {
        const { username = '', avatar } = userStore.getUserInfo || {};
        return { username, avatar };
    });
</script>

<style lang="less" scoped>
    @prefix-cls: ~'@{namespace}-header-user';
    .@{prefix-cls} {
        height: @header-height;
        padding: 0 0 0 10px;
        padding-right: 10px;
        overflow: hidden;
        font-size: 12px;
        cursor: pointer;
        align-items: center;
    }

    img {
        width: 24px;
        height: 24px;
        margin-right: 12px;
    }

    &__header {
        border-radius: 50%;
    }

    &__name {
        font-size: 14px;
    }
</style>
