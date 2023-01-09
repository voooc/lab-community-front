<template>
    <div ref="plotly"></div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        data: {
            type: Object,
            required: true,
        },
        layout: {
            type: Object,
        },
        config: {
            type: Object,
        },
    });

    const emit = defineEmits(['loaded']);

    const plotly = ref<HTMLElement>();

    onMountedOrActivated(() => {
        Plotly.newPlot(plotly.value, props.data, props.layout, props.config);
    });

    watch(
        () => props,
        async () => {
            await Plotly.react(plotly.value, props.data, props.layout, props.config);
            await Plotly.Plots.resize(plotly.value);
            emit('loaded');
        },
        {
            deep: true,
        },
    );
</script>

<script lang="ts">
    import { onMountedOrActivated } from '@/hooks/core/onMountedOrActivated';
    import Plotly from 'plotly.js-dist-min';
    import { ref, watch } from 'vue';

    export default {
        name: 'Plotly',
    };
</script>
