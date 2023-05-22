<template>
    <CollapseContainer title="安全设置" :canExpan="false">
        <a-list>
            <template v-for="item in secureSettingList" :key="item.key">
                <a-list-item>
                    <a-list-item-meta>
                        <template #title>
                            {{ item.title }}
                            <div class="extra" v-if="item.extra" @click="handleOpen">
                                {{ item.extra }}
                            </div>
                        </template>
                        <template #description>
                            <div>{{ item.description }}</div>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
        <SecureModal @register="registerModal" />
    </CollapseContainer>
</template>
<script lang="ts" setup>
    import { CollapseContainer } from '@/components/Container/index';
    import SecureModal from './SecureModal.vue';
    import { secureSettingList } from './data';
    import { useModal } from '@/components/Modal';
    const [registerModal, { openModal }] = useModal();
    function handleOpen() {
        openModal(true);
    }
</script>
<style lang="less" scoped>
    .extra {
        margin-top: 10px;
        margin-right: 30px;
        float: right;
        color: #1890ff;
        font-weight: normal;
        cursor: pointer;
    }
</style>
