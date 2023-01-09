<template>
    <a-input-group compact class="w-full !flex target-select">
        <a-select
            v-model:value="targetNames"
            show-search
            :mode="multiple ? 'multiple' : ''"
            :placeholder="t('component.targetSelect.title')"
            class="flex-1 !border-none target-name w-full overflow-x-hidden"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="dataSource"
            @search="handleSearch"
            option-label-prop="value"
            allow-clear
        />
        <Button
            pre-icon="ant-design:search-outlined"
            type="primary"
            :loading="loading"
            @click="onSearchClick"
            >{{ t('component.targetSelect.title') }}</Button
        >
    </a-input-group>
</template>

<script lang="ts">
    export default {
        name: 'TargetSelect',
    };
</script>

<script lang="ts" setup>
    import { ref, computed } from 'vue';
    import { getSuggestion } from '@/api/task';
    import { SelectTypes } from 'ant-design-vue/es/select';
    import { Button } from '@/components/Button';
    import { useI18n } from '@/hooks/web/useI18n';

    const { t } = useI18n();

    const props = defineProps({
        value: {
            type: [Array, String],
            required: true,
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    });

    const emit = defineEmits(['update:value', 'search']);

    const targetNames = computed({
        get() {
            if (props.multiple) {
                return Array.isArray(props.value) ? props.value : [props.value];
            } else {
                return props.value;
            }
        },
        set(val) {
            emit('update:value', val);
        },
    });
    const dataSource = ref<SelectTypes['options']>([]);
    const handleSearch = async (val: string) => {
        const res = await getSuggestion({ target: val });
        // @ts-ignore
        dataSource.value = res.suggestions.map((item) => {
            const option = {
                label: item.value,
                value: item.symbol,
            };
            return option;
        });
    };
    const onSearchClick = () => {
        emit('search', targetNames.value);
    };
</script>

<style lang="less" scoped>
    .target-select {
        :deep(.ant-select-selector) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-right: none;

            .ant-select-selection-overflow {
                flex-wrap: nowrap;
                overflow-x: auto;
            }
        }

        :deep(.ant-btn) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
</style>
