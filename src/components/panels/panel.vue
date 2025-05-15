<template>
    <div
        :class="
            config.type !== PanelType.Text
                ? `${
                      config.type === PanelType.Map ? 'overflow-x-auto overflow-y-hidden' : ''
                  } sm:self-start flex-2 min-w-0`
                : 'flex flex-1'
        "
        class="flex-col relative"
    >
        <component
            :is="getTemplate()"
            :config="config"
            :configFileStructure="configFileStructure"
            :slideIdx="slideIdx"
            :lang="lang"
            :style="config.customStyles"
            :class="config.cssClasses"
            :isSlideshowItem="isSlideshowItem"
            :lazyLoad="lazyLoad"
            :background="background"
        ></component>
    </div>
</template>

<script setup lang="ts">
import type { Component, PropType } from 'vue';
import { BasePanel, ConfigFileStructure, PanelType } from '@storylines/definitions';

import TextPanel from './text-panel.vue';
import MapPanel from './map-panel.vue';
import InteractiveMap from './interactive-map.vue';
import ImagePanel from './image-panel.vue';
import InteractiveImagePanel from './interactive-image-panel.vue';
import VideoPanel from './video-panel.vue';
import SlideshowPanel from './slideshow-panel.vue';
import ChartPanel from './chart-panel.vue';
import DynamicPanel from './dynamic-panel.vue';
import LoadingPanel from './loading-panel.vue';

const props = defineProps({
    config: {
        type: Object as PropType<BasePanel>,
        required: true
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    },
    ratio: {
        type: Boolean
    },
    slideIdx: {
        type: Number
    },
    lang: {
        type: String
    },
    background: {
        type: Boolean
    },
    lazyLoad: {
        type: Boolean
    },
    isSlideshowItem: {
        type: Boolean,
        required: false
    }
});

/**
 * Returns the corresponding component for this panel.
 */
const getTemplate = (): Component => {
    const panelTemplates: Record<PanelType | string, Component> = {
        [PanelType.Text]: TextPanel,
        [PanelType.Map]: MapPanel,
        [PanelType.InteractiveMap]: InteractiveMap,
        [PanelType.Image]: ImagePanel,
        [PanelType.InteractiveImage]: InteractiveImagePanel,
        [PanelType.Video]: VideoPanel,
        [PanelType.Slideshow]: SlideshowPanel,
        [PanelType.SlideshowImage]: SlideshowPanel,
        [PanelType.SlideshowChart]: SlideshowPanel,
        [PanelType.Chart]: ChartPanel,
        [PanelType.Dynamic]: DynamicPanel,
        [PanelType.Loading]: LoadingPanel
    };

    return panelTemplates[props.config.type];
};
</script>

<style lang="scss" scoped></style>
