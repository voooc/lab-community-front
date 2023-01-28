<template>
    <a-layout-header class="header" :style="getHeaderStyle">
        <div class="logo">
            <img src="@/assets/images/logo.png" class="w-full h-full" />
        </div>
        <Menu class="!ml-50px" />
        <UserIcon class="ml-auto" />
    </a-layout-header>
</template>
<script lang="ts">
    export default {
        name: 'Header',
        inheritAttrs: false,
    };
</script>
<script lang="ts" setup>
    import { computed, CSSProperties, onMounted, ref } from 'vue';
    import Menu from './menu.vue';
    import UserIcon from './UserIcon.vue';
    const getHeaderStyle = computed(
        (): CSSProperties => ({
            boxShadow: top.value ? '0px 1px 10px 0px rgba(0, 0, 0, 0.1)' : 'none',
        }),
    );
    const top = ref<number>(0);
    function getScollTop(e) {
        top.value = e.target.scrollTop;
    }
    onMounted(() => {
        window.addEventListener('scroll', getScollTop, true);
    });
</script>
<style lang="less" scoped>
    .header {
        position: fixed;
        z-index: 100;
        padding: 0 12px;
        left: 0;
        right: 0;
        top: 0;
        display: flex;
        background-color: #fff;
        align-items: center;
        transition: all 1s ease-out;

        .logo {
            height: 53px;
            width: 177px;
            flex-shrink: 0;
        }
    }
</style>
