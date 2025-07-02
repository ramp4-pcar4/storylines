<template>
    <div class="graphic self-start flex flex-col h-full align-middle pb-5 w-full">
        <fullscreen :expandable="config.fullscreen" :type="config.type">
            <img
                ref="img"
                :src="lazyLoad && slideIdx > 2 ? '' : state.src"
                :class="[config.class, config.caption ? 'rounded-t-lg' : 'rounded-lg']"
                :alt="config.altText || ''"
                :style="{ width: `${config.width}px`, height: `${config.height}px`}"
                class="graphic-image mx-auto flex object-contain sm:max-w-screen sm:max-h-screen"
            />
        </fullscreen>

        <div
            v-if="config.caption"
            class="text-center text-sm max-w-full graphic-caption"
            v-html="md.render(config.caption)"
            :class="{ 'has-background': background }"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, onUpdated, reactive, ref } from 'vue';
import type { PropType } from 'vue';
import type { ImagePanel, ConfigFileStructure } from '@storylines/definitions';

import MarkdownIt from 'markdown-it';
import Fullscreen from '@storylines/components/panels/helpers/fullscreen.vue';

const props = defineProps({
    config: {
        type: Object as PropType<ImagePanel>,
        required: true
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    },
    slideIdx: {
        type: Number,
        default: 0
    },
    background: {
        type: Boolean
    },
    lazyLoad: {
        type: Boolean
    },
    forceLoad: {
        type: Boolean
    }
});

const img = ref<Element>();
const md = new MarkdownIt({ html: true });
const state = reactive({
    src: ''
});

const observer = ref<IntersectionObserver | undefined>(undefined);
const loaded = ref<Boolean>(false);

onUpdated(() => {
    // Only needs to occur once.
    if (!loaded.value && props.forceLoad) {
        (img.value as Element).setAttribute('src', props.config.src);
        getCurrentInstance()?.proxy?.$forceUpdate();
        loaded.value = true;
    }
});

onMounted((): void => {
    state.src = props.config.src ? props.config.src : '';
    loaded.value = !props.lazyLoad; // if lazy loading is enabled, the image content will initially not be loaded

    if (props.lazyLoad && props.slideIdx > 2) {
        observer.value = new IntersectionObserver(([image]) => {
            // dont want video to be loaded a second time if it was force loaded already
            if (loaded.value) {
                (observer.value as IntersectionObserver).disconnect();
            }
            // lazy load images
            else if (image.isIntersecting) {
                (img.value as Element).setAttribute('src', props.config.src);
                getCurrentInstance()?.proxy?.$forceUpdate();
                (observer.value as IntersectionObserver).disconnect();
                loaded.value = true;
            }
        });
    }

    // obtain image files from ZIP folder in editor preview mode
    if (props.configFileStructure) {
        const image = props.config;
        const assetSrc = `${image.src.substring(image.src.indexOf('/') + 1)}`;
        const imageFile = props.configFileStructure?.zip.file(assetSrc);
        const imageType = assetSrc.split('.').at(-1);
        const imageName = image.src.replace(/^.*[\\/]/, '');
        if (imageFile) {
            // Convert the image to a blob so it can be displayed locally.
            if (imageType !== 'svg') {
                imageFile.async('blob').then((res: Blob) => {
                    state.src = props.config.src = URL.createObjectURL(res);
                });
            } else {
                imageFile.async('text').then((res) => {
                    const image = new File([res], imageName, { type: 'image/svg+xml' });
                    state.src = props.config.src = URL.createObjectURL(image);
                });
            }
        }
    }

    if (!img.value) {
        // TODO remove this if no one ever sees this message by Dec 2025
        console.error('image-panel: Bound element did not exist after mount');
        console.trace();
    }

    observer.value?.observe(img.value as Element);
});
</script>

<style lang="scss" scoped>
.has-background {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 0px 0px 8px 8px;
    color: black;
}
@media screen and (max-width: 640px) {
    .graphic {
        max-width: 100vw;
        max-height: 60vh;
        overflow-y: auto;
        background-color: white;

        box-shadow: 1px 2px 5px #ddd;
    }

    .graphic-image {
        max-height: 38vh;
    }
}
</style>
