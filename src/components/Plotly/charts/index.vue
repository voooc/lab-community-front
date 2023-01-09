<template>
    <div class="h-full chart" ref="plotyDiv" :style="computedStyle">
        <Plotly :data="chart" :layout="computedLayout" :config="config" @loaded="onLoaded" />
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        data: {
            type: Object as PropType<ResultChartData>,
            required: true,
        },
        layout: {
            type: Object as PropType<any>,
        },
    });

    const emit = defineEmits(['loaded']);

    const plotyDiv = ref<HTMLElement>();

    const onLoaded = () => {
        emit('loaded');
    };

    const config = reactive({
        modeBarButtonsToRemove: [],
        responsive: true,
        displayModeBar: false,
    });

    const chart = computed(() => {
        if (props.data.chart_type === ChartType.QC) {
            return [
                {
                    name: '',
                    type: 'violin',
                    y: props.data.points,
                    text: props.data.points,
                    points: 'all',
                    pointpos: 0,
                    boxpoints: false,
                    opacity: 0.7,
                    autosize: true,
                    fillcolor: 'rgba(99, 110, 250, 0.5)',
                    hoverinfo: 'y',
                    hoveron: 'points',
                    line: {
                        color: 'black',
                        width: 2,
                    },
                    jitter: 1,
                    marker: {
                        size: 1,
                        opicaty: 0.7,
                    },
                    meanline: {
                        visible: true,
                    },
                    box: {
                        visible: false,
                    },
                },
            ];
        } else if (props.data.chart_type === ChartType.Cluster) {
            const points = props.data.points as ClusterPoint[];
            const group = points.reduce((accur, cur) => {
                if (Array.isArray(accur[cur.label])) {
                    accur[cur.label].push(cur);
                } else {
                    accur[cur.label] = [cur];
                }
                return accur;
            }, {});
            return Object.keys(group).map((key) => {
                const name = key.length > 40 ? `${key.slice(0, 15)} <br> ${key.slice(10)}` : key;
                return {
                    mode: 'markers',
                    type: 'scattergl',
                    hoverinfo: 'text',
                    text: name,
                    x: group[key].map((point) => point.x),
                    y: group[key].map((point) => point.y),
                    marker: {
                        size: 4,
                        colorscale: 'Categorical',
                    },
                    name,
                };
            });
        } else if (props.data.chart_type === ChartType.Gene) {
            const points = props.data.points as GeneExpressPoint[];
            return [
                {
                    mode: 'markers',
                    type: 'scattergl',
                    hoverinfo: 'text',
                    text: points.map((point) => point.value),
                    x: points.map((point) => Number(point.x)),
                    y: points.map((point) => Number(point.y)),
                    marker: {
                        size: 4,
                        opacity: 0.7,
                        colorbar: {
                            x: 1,
                            y: 0.5,
                            xanchor: 'left',
                            ypad: 0,
                            xpad: 2,
                            showticklabels: true,
                        },
                        // colorscale: 'Portland',
                        color: points.map((point) => Number(point.value)),
                        colorscale: [
                            [0, '#ffd8bf'],
                            [0.3575418994413408, '#ffbb96'],
                            [0.44692737430167595, '#ff9c6e'],
                            [0.5363128491620112, '#ff7a45'],
                            [0.6256983240223464, '#fa541c'],
                            [0.7150837988826816, '#d4380d'],
                            [0.8044692737430168, '#ad2102'],
                            [1, '#871400'],
                        ],
                    },
                },
            ];
        }
        return {};
    });

    const computedLayout = computed(() => {
        if (props.data.chart_type === ChartType.QC) {
            return {
                title: {
                    text: props.data.title,
                    xref: 'container',
                    yref: 'container',
                    x: 0,
                    y: 'auto',
                    xanchor: 'auto',
                    yanchor: 'auto',
                },
                legend: {
                    yref: 'paper',
                    font: {
                        family: 'Arial, sans-serif',
                        size: 18,
                        color: 'grey',
                    },
                },
                modebar: {
                    orientation: 'h',
                },
                margin: {
                    t: 40,
                    l: 40,
                    r: 40,
                    b: 40,
                },
                pad: {
                    r: 20,
                },
                autosize: true,
                violingap: 0,
                violingroupgap: 0.18,
                xaxis: {
                    name: props.data.x_axis,
                    linecolor: 'black',
                    linewidth: 1,
                    showticklabels: props.data.chart_type === ChartType.QC,
                    mirror: props.data.chart_type !== ChartType.QC,
                    gridcolor: 'white',
                    zeroline: false,
                },
                yaxis: {
                    range: [0],
                    rangemode: 'nonnegative',
                    name: props.data.y_axis,
                    showticklabels: props.data.chart_type === ChartType.QC,
                    linecolor: 'black',
                    linewidth: 1,
                    mirror: props.data.chart_type !== ChartType.QC,
                    gridcolor: '#bebada',
                    zeroline: false,
                },
            };
        } else {
            return {
                title: {
                    text: props.data.title,
                    y: 'auto',
                    xref: 'container',
                    yref: 'container',
                },
                xaxis: {
                    title: {
                        text: `<b>${props.data.x_axis}</b>`,
                    },
                    showgrid: false,
                    showticklabels: false,
                    showspikes: false,
                    showline: true,
                    zeroline: false,
                    linecolor: 'rgb(0, 2, 5)',
                    mirror: 'ticks',
                },
                yaxis: {
                    title: {
                        text: `<b>${props.data.y_axis}</b>`,
                    },
                    showgrid: false,
                    showticklabels: false,
                    showspikes: false,
                    showline: true,
                    zeroline: false,
                    linecolor: 'rgb(0, 2, 5)',
                    mirror: 'ticks',
                },
                legend: {
                    font: {
                        size: 12,
                    },
                    itemsizing: 'constant',
                    x: 1.01,
                    y: 1,
                },
                pad: {
                    r: 200,
                },
                modebar: {
                    orientation: 'h',
                },
                autosize: true,
                margin: {
                    t: 40,
                    l: 40,
                    r: 40,
                    b: 40,
                },
                ...props.layout,
            };
        }
    });

    const computedStyle = computed(() => {
        if (props.data.chart_type === ChartType.Cluster) {
            let width = 450;
            const max = Math.max(
                ...(props.data.points as ClusterPoint[]).map((point) => (point.label || '').length),
            );
            if (max > 40) {
                width += 320;
            } else {
                width += max * 8;
            }
            return {
                width: `${width}px`,
            };
        }
        return {};
    });
</script>

<script lang="ts">
    import { Plotly } from '@/components/Plotly';
    import { ChartType, ClusterPoint, GeneExpressPoint, ResultChartData } from '@/models/task';
    import { computed, reactive, ref } from 'vue';

    export default {
        name: 'Chart',
    };
</script>

<style lang="less">
    .js-plotly-plot {
        height: 100%;

        .plotly {
            height: 100%;

            .modebar-btn {
                display: inline-block;
            }
        }
    }
</style>
