<template>
    <div class="user flex">
        <template v-if="userInfo.image && userInfo.username">
            <User />
        </template>
        <div v-else class="flex">
            <span>
                <a-button @click="setLoginState(LoginStateEnum.LOGIN)" style="margin-right: 10px">
                    <router-link to="/login">登录</router-link>
                </a-button>
                <a-button type="primary" @click="setLoginState(LoginStateEnum.REGISTER)">
                    <router-link to="/login">注册</router-link>
                </a-button>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'UserIcon',
    };
</script>

<script lang="ts" setup>
    import { computed } from 'vue';
    import { LoginStateEnum, useLoginState } from '@/views/sys/login/useLogin';
    import { useUserStoreWithOut } from '@/store/modules/user';
    import User from './user.vue';
    const { setLoginState } = useLoginState();
    const userStore = useUserStoreWithOut();
    const userInfo = computed(() => {
        const {
            username = '',
            image,
            id,
            fan,
            follow,
        } = userStore.getUserInfo || {
            username: null,
            image: null,
            id: null,
            fan: null,
            follow: null,
        };
        return { username, image, id, fan, follow };
    });
</script>
