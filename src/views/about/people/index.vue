<template>
    <div class="container my-25px mx-auto text-center">
        <div class="title">团队成员</div>
        <div class="content grid grid-cols-3 gap-5">
            <div v-for="item in data" :key="item.id">
                <a-card hoverable style="width: 300px" @click="handleClick(item.id)">
                    <template #cover>
                        <img
                            alt="example"
                            :src="item.image"
                            class="h-180px"
                            style="object-fit: cover"
                        />
                    </template>
                    <a-card-meta :title="item.name" :description="item.desc" />
                </a-card>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { getUserAll } from '@/api/sys/user';
    import { UserInfo } from '@/models/user/user';
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    const data = ref<Array<UserInfo>>([]);
    const router = useRouter();
    function handleClick(id) {
        router.push({ name: 'user-center', params: { id: id } });
    }
    onMounted(async () => {
        const res = await getUserAll({});
        data.value = res.items;
    });
</script>
<style lang="less" scoped>
    .title {
        font-size: 30px;
        margin-bottom: 25px;
    }
</style>
