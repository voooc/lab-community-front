<template>
    <MdEditor.DropdownToolbar
        :title="props.type === 'code' ? '代码高亮样式' : 'markdown主题'"
        :visible="state.visible"
        @on-change="onChange"
        :class="props.type"
    >
        <template #overlay>
            <div class="code-theme-container">
                <ul>
                    <li
                        class="menu-item"
                        v-for="(theme, index) in data"
                        :key="index"
                        :class="active === theme ? 'active' : ''"
                        @click="handleCode(theme)"
                        ><span>{{ theme }}</span></li
                    >
                </ul>
            </div>
        </template>
        <template #trigger>
            <template v-if="props.type === 'code'">
                <appstore-outlined
                    :class="props.type"
                    style="width: 24px; height: 24px; display: flex; align-items: center"
                />
            </template>
            <template v-else>
                <highlight-outlined
                    :class="props.type"
                    style="width: 24px; height: 24px; display: flex; align-items: center"
                />
            </template>
        </template>
    </MdEditor.DropdownToolbar>
</template>

<script lang="ts" setup>
    import { reactive, defineEmits, ref, defineProps, computed } from 'vue';
    import MdEditor from 'md-editor-v3';
    import { AppstoreOutlined, HighlightOutlined } from '@ant-design/icons-vue';
    import 'md-editor-v3/lib/style.css';
    import { codeTheme, markdownTheme } from './data';
    const props = defineProps({
        type: {
            type: String as PropType<string>,
        },
    });
    const active = ref(props.type === 'code' ? 'atom' : 'default');
    const data = computed(() => {
        return props.type === 'code' ? codeTheme : markdownTheme;
    });
    const emit = defineEmits(['code']);
    const handleCode = (theme: string) => {
        active.value = theme;
        emit('code', theme);
    };
    const state = reactive({
        visible: false,
    });
    const onChange = (visible: boolean) => {
        state.visible = visible;
    };
</script>

<script lang="ts">
    export default {
        name: 'EmojiExtension',
    };
</script>
