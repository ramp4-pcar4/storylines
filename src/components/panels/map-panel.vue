<template>
    <div
        ref="el"
        class="flex flex-col h-full align-middle w-full"
        :class="{ 'map-box': !isSlideshowItem && !config.teleportGrid }"
    >
        <div
            class="px-10 mb-0 chapter-title top-20 map-title text-center"
            :class="{ 'has-background': background }"
            v-if="config.title"
        >
            {{ config.title }}
        </div>

        <div class="grid-teleport flex sm:flex-row flex-col w-full min-h-0 sm:h-story" v-if="config.teleportGrid">
            <div
                v-if="config.teleportGrid === 'left'"
                class="storylines-grid-container flex-1 min-w-0 min-h-0 ramp-styles order-2"
                ref="grid"
            ></div>
            <div
                :id="`ramp-map-${slideIdx}`"
                class="rv-map flex-2 min-w-0 bg-gray-200"
                :class="{
                    'sm:order-2 order-1': config.teleportGrid === 'left'
                }"
            ></div>
            <div
                v-if="config.teleportGrid === 'right'"
                class="storylines-grid-container flex-1 min-w-0 min-h-0 ramp-styles"
                ref="grid"
            ></div>
        </div>
        <div :id="`ramp-map-${slideIdx}`" class="rv-map w-full bg-gray-200 sm:h-story min-h-0 flex-1" v-else></div>

        <div
            v-if="config.caption"
            class="text-center text-sm max-w-full map-caption"
            v-html="md.render(config.caption)"
            :class="{ 'caption-has-background': background }"
        ></div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { onMounted, ref } from 'vue';
import MarkdownIt from 'markdown-it';
import { i18n } from '@storylines/lang';
import { createInstance } from 'ramp-pcar';
import type { ConfigFileStructure, MapPanel, TimeSliderConfig } from '@storylines/definitions';
import { TimeSliderFixture } from '@storylines/components/panels/helpers/time-slider/index';

const props = defineProps({
    config: {
        type: Object as PropType<MapPanel>,
        required: true
    },
    slideIdx: {
        type: Number
    },
    lang: {
        type: String
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    },
    background: {
        type: Boolean
    },
    isSlideshowItem: {
        type: Boolean
    }
});

const el = ref();
const grid = ref();
const intersectTimeoutHandle = ref(-1);
const mapComponent = ref<Element | undefined>(undefined);
const md = new MarkdownIt({ html: true });

onMounted(() => {
    const observer = new IntersectionObserver(
        ([e]) => {
            if (e.isIntersecting) {
                intersectTimeoutHandle.value = window.setTimeout(() => {
                    init();
                    observer.disconnect();
                    mapComponent.value?.querySelector('.map-loading')?.remove();
                }, 350);
            } else {
                clearTimeout(intersectTimeoutHandle.value);
            }
        },
        { threshold: [0] }
    );

    if (!el.value) {
        // TODO remove this if no one ever sees this message by Dec 2025
        console.error('map-panel: Bound element did not exist after mount');
        console.trace();
    }

    observer.observe(el.value as Element);
});

const init = async () => {
    // Find the correct map component based on whether there's a title component.
    const mapIndex = !!props.config.title ? 1 : 0;
    if (props.config.teleportGrid === 'left') {
        mapComponent.value = el.value.children[mapIndex].children[1];
    } else if (props.config.teleportGrid === 'right') {
        mapComponent.value = el.value.children[mapIndex].children[0];
    } else {
        mapComponent.value = el.value.children[mapIndex];
    }

    // If the configFileStructure object is provided (editor preview mode), grab the config from there.
    if (props.configFileStructure) {
        const assetSrc = `${props.config.config.substring(props.config.config.indexOf('/') + 1)}`;
        const mapFile = props.configFileStructure.zip.file(assetSrc);
        if (mapFile) {
            mapFile.async('string').then((res: string) => {
                const cleanRes = res.replace(/^\uFEFF/, ''); // Remove BOM if present.
                setupMap(JSON.parse(cleanRes));
            });
        }
    } else {
        // Otherwise fetch it from the server.
        fetch(props.config.config).then((data) => {
            // parse JSON data
            data.json().then((rampConfig: any) => {
                setupMap(rampConfig);
            });
        });
    }
};

const setupMap = (config: any) => {
    if (props.config.teleportGrid) {
        // get grid container element to teleport grid to and save to config
        config.configs.en.fixtures.grid.panelTeleport.target = grid.value;
        config.configs.fr.fixtures.grid.panelTeleport.target = grid.value;
    }

    const rInstance = createInstance(mapComponent.value as HTMLElement, config);
    if (props.config.teleportGrid) {
        // open teleported grid after map + layer loaded
        const gridId = config.configs[props.lang as string].layers[0].id;
        rInstance.event.on(
            'layer/layerstatechange',
            () => {
                if (rInstance.geo.layer.allLayers().every((l: any) => l.isLoaded)) {
                    rInstance.event.emit('grid/toggle', rInstance.geo.layer.getLayer(gridId));
                    rInstance.event.off('initial_grid');
                }
            },
            'initial_grid'
        );
    }

    // Add the scrollguard fixture and enable it if desired.
    // If the scrollguard was already added previously, add does nothing, so no harm done!
    if (props.config.scrollguard) {
        rInstance.fixture.add('scrollguard').then((scrollguardFixture: any) => {
            scrollguardFixture.setEnabled(true);
        });
    }

    if (props.config.timeSlider) {
        rInstance.fixture.add('time-slider', TimeSliderFixture).then((ts: TimeSliderFixture) => {
            ts.initTimeSlider(props.config.timeSlider as TimeSliderConfig, i18n);
        });
    }

    // Dispatch an event to indicate that the map has been loaded.
    const event = new CustomEvent('map-created', {
        detail: { rInstance: rInstance, customTemplates: props.config.customTemplates }
    });
    document.dispatchEvent(event);
};
</script>

<style lang="scss" scoped>
.rv-map {
    width: 100%;

    :deep(.time-slider-container) {
        bottom: 53px;
        right: 60px;
        left: auto;
        top: auto;
        width: 55%;
        padding: 5px;
        height: 110px;
        position: absolute;
        z-index: 5;
    }
    :deep(.time-slider-container.minimized) {
        height: 50px;
    }
}

.toc-horizontal .storylines-grid-container {
    height: calc(100vh - 4rem - 2.75rem) !important; // 4rem for the header, 2.75 for the horizontal ToC.
}

.toc-horizontal .map-box {
    height: calc(100vh - 4rem - 2.75rem);
}
.toc-vertical .map-box {
    height: calc(100vh - 4rem);
}

.has-background {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 8px 8px 0px 0px;
    margin-bottom: 0em !important;
    padding-bottom: 1em;
    color: black;
}

.map-caption {
    background-color: rgba(255, 255, 255, 1);
}

.caption-has-background {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 0px 0px 8px 8px;
    color: black;
}

.map-title {
    color: #111827;
    font-weight: 700;
    font-size: 1.5em;
    margin-top: 1em;
    margin-bottom: 1em;
    line-height: 1.3333333;
}
@media screen and (max-width: 640px) {
    .rv-map {
        max-height: 50vh;

        :deep(.time-slider-container) {
            left: 52px !important;
            right: 60px !important;
            bottom: 41px !important;
            width: auto !important;
            max-height: 90px;
        }

        :deep(.time-slider-container.minimized) {
            height: 32px;
        }
    }

    .grid-teleport {
        height: 100vh;

        .storylines-grid-container {
            height: 60vh;
        }
    }

    .map-title {
        margin: 0em;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        background: #fff;
    }

    .map-box {
        height: 50vh !important; // horizontal ToC is not visible on mobile, so don't remove the extra 2.75rem height
    }
}

@media screen and (min-width: 640px) {
    .toc-horizontal .rv-map,
    .toc-horizontal .storylines-grid-container {
        height: calc(100vh - 4rem - 2.75rem) !important; // 4rem for the header, 2.75 for the horizontal ToC.
    }

    .toc-vertical .rv-map {
        height: calc(100vh - 4rem) !important;
    }
}

:deep(rv-basemap-item .rv-basemap-thumb img) {
    max-width: none;
}
:deep(.rv-details-attrib-value a) {
    white-space: unset !important;
}

$font-list:
    'Montserrat',
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Helvetica,
    Arial,
    sans-serif,
    Apple Color Emoji,
    Segoe UI Emoji;
:deep(.ramp-app) {
    height: 100%;
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    .h1,
    .h2,
    .h3,
    .h4,
    .h5,
    .h6 {
        font-family: $font-list;
        line-height: 1.5;
    }

    input[type='checkbox'] {
        margin-top: unset;
    }
}
</style>
