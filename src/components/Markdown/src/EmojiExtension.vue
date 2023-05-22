<template>
    <MdEditor.DropdownToolbar title="emoji" :visible="state.visible" @on-change="onChange">
        <template #overlay>
            <div class="emoji-container">
                <ol class="emojis">
                    <li
                        v-for="(emoji, index) of emojis"
                        :key="`emoji-${index}`"
                        @click="emojiHandler(emoji)"
                        v-text="emoji"
                    ></li>
                </ol>
            </div>
        </template>
        <template #trigger>
            <smile-outlined />
        </template>
    </MdEditor.DropdownToolbar>
</template>

<script lang="ts" setup>
    import { reactive } from 'vue';
    import MdEditor from 'md-editor-v3';
    import 'md-editor-v3/lib/style.css';
    import type { PropType } from 'vue';
    import { SmileOutlined } from '@ant-design/icons-vue';
    import type { InsertContentGenerator } from 'md-editor-v3';
    import { emojis } from './data';
    const props = defineProps({
        onInsert: {
            type: Function as PropType<(generator: InsertContentGenerator) => void>,
            default: () => () => null,
        },
    });
    const state = reactive({
        visible: false,
    });
    const emojiHandler = (emoji: string) => {
        const generator: InsertContentGenerator = () => {
            return {
                targetValue: emoji,
                select: true,
                deviationStart: 0,
                deviationEnd: 0,
            };
        };
        props.onInsert(generator);
    };
    const onChange = (visible: boolean) => {
        state.visible = visible;
    };
</script>

<script lang="ts">
    export default {
        name: 'EmojiExtension',
    };
</script>
