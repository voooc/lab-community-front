<template>
    <a-layout-header class="header">
        <div class="logo">
            <img src="@/assets/images/logo.png" class="w-full h-full" />
        </div>
        <Menu class="!ml-50px flex-1" />
        <div class="ml-auto flex item-center h-full">
            <Search />
            <UserIcon />
        </div>
    </a-layout-header>
</template>
<script lang="ts">
    export default {
        name: 'Header',
        inheritAttrs: false,
    };
</script>
<script lang="ts" setup>
    import Menu from './menu.vue';
    import UserIcon from './UserIcon.vue';
    import Search from './search.vue';
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
        transition: all 0.3s;
        border-bottom: 1px solid #f1f1f1;

        .logo {
            height: 53px;
            width: 177px;
            flex-shrink: 0;
        }
    }
</style>
