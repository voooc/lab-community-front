<template>
    <MdEditor.MdCatalog v-bind="$attrs" :editorId="props.editorId" />
</template>
<script lang="ts" setup>
    import { defineProps } from 'vue';
    import MdEditor from 'md-editor-v3';
    const props = defineProps({
        editorId: {
            type: String as PropType<string>,
            required: true,
        },
    });
</script>
