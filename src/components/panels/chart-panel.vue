<template>
    <div class="chart self-center mb-8 mx-auto bg-gray-200_">
        <chart :config="config" :configFileStructure="configFileStructure" />
        <div class="text-center w-full p-2 text-sm" :class="{ 'has-background': background }">
            {{ config.caption }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { ChartPanel, ConfigFileStructure } from '@storylines/definitions';
import Chart from '@storylines/components/panels/helpers/chart.vue';

defineProps({
    config: {
        type: Object as PropType<ChartPanel>,
        required: true
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    },
    background: {
        type: Boolean
    }
});
</script>

<style lang="scss" scoped>
.chart {
    height: auto;
}

.has-background {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 0px 0px 8px 8px;
    color: black;
}

@media screen and (max-width: 640px) {
    .chart {
        max-width: 100vw;
        background-color: white;
    }
}
</style>
