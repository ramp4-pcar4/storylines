<template>
    <div
        ref="el"
        :id="key"
        class="story-slide w-full h-full flex flex-col"
        :class="!!config.reversed ? 'sm:flex-row-reverse' : 'sm:flex-row'"
    >
        <div
            class="sticky prose max-w-none min-w-0 mb-5 mx-1 py-0 sm:self-start sm:py-5 z-40"
            :class="{ 'has-background': background, 'flex-1': !!config.contentWidth === false }"
            :style="{
                width: !isMobile ? `${config.contentWidth}` : undefined
            }"
        >
            <component
                :is="config.titleTag || 'h2'"
                class="px-10 image-title mb-0 chapter-title top-20"
                :style="activeIdx !== defaultPanel.id ? 'margin-top: 0px;' : ''"
            >
                {{ config.title }}
            </component>

            <div class="md-content relative">
                <img
                    ref="img"
                    :src="activeImage?.src || ''"
                    :class="config.class"
                    :alt="activeImage?.altText || ''"
                    :style="{ width: `${config.width}px`, height: `${config.height}px` }"
                    class="mx-auto flex object-contain sm:max-w-screen sm:max-h-screen story-graphic"
                />
                <div
                    v-for="zone in config.zones"
                    class="absolute cursor-pointer interactive-zone"
                    tabindex="0"
                    :class="zone.class"
                    :style="{
                        width: `${zone.width}`,
                        height: `${zone.height}`,
                        top: `${zone.top}`,
                        left: `${zone.left}`
                    }"
                    @focusin="zoneMouseEnter(zone)"
                    @focusout="zoneMouseLeave(zone)"
                    @keypress.enter="zoneClick(zone)"
                    @click="zoneClick(zone)"
                    @mouseenter="zoneMouseEnter(zone)"
                    @mouseleave="zoneMouseLeave(zone)"
                ></div>
            </div>
        </div>

        <div
            :class="
                activeConfig.type !== 'text'
                    ? `top-0 sm:self-start flex-1 dynamic-content-media sm:flex-col min-w-0`
                    : 'flex-1 dynamic-content-text'
            "
        >
            <span class="return-button-container" v-if="activeIdx !== defaultPanel.id && !config.hideReturn">
                <button
                    class="py-1 text-base absolute"
                    :class="!!config.reversed === false ? 'return-button right-0' : 'return-button-reversed'"
                    @click="clickBack"
                >
                    <img
                        style="display: inline; margin: 0px"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAB4UlEQVRIie3WP08WQRAG8J+2SolRQaLyKvR+BTsVaQnfwD9YCH4PS6I2ViAS1GhMKLWESkzUmBAT7azECoS8Fjcvqxe52zuMseBJNpebe2ae2dmdveUA/wiHGnCHcBWXcBqDYf+CT3iOp/j8t5IbwCy20a0ZO3gUie0L4/geQTcxhwmM4EiMkbDNB6eLDYy1Fb2lmEEXj3E2w2cYi9Lsp5qKjofjNm43dcZ0+O9oMPNBqbxtRHuYkcp+MsfhgVTe/WIpYt2rIw4pyrtp7zU9hlW8zhDuRKxtqf3+iJuR4VyF6FpwVjKEKdqri+tVpJdBmqgRXYv3HEyGz4sq0scgnSvZ+/Emvr3D8UxRij7v4n0VaSNIfSX7qvpTqzfKa98n7e5dHG6QeS66bZw+hOP5kr1c6hMNYo7+4reL8ozX43mhZP+Ki3gbgZblb65erPUq0o3Ibn6P723aaSH416pIp6QDZLhCfAWvMkQ72MIPNQcI3I8MFzMC1+FJxJrNIQ9IbTW9D9E7EeObBptxTPqtzbQU7flfaeo8JV0ElhTrVYeOVN4dxdnfCmNS2bcUB/6koqWOxhgN20JweuW93Fa0h37cVezMnMveQxlr2uR6Oyhdb8/4/Xq7rvj7PIv3A/w/+Am/TqGFCMnpPgAAAABJRU5ErkJggg=="
                        :alt="$t('dynamic.back')"
                    />
                    {{ $t('dynamic.back') }}
                </button>
            </span>
            <panel
                class="flex-2"
                :config="activeConfig"
                :configFileStructure="configFileStructure"
                :slideIdx="slideIdx"
                :dynamicIdx="activeIdx"
                :ratio="false"
                :background="background"
                ref="content"
            >
            </panel>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { defineAsyncComponent, getCurrentInstance, onMounted, onUpdated, ref } from 'vue';
import type {
    BasePanel,
    ConfigFileStructure,
    Image,
    InteractiveImagePanel,
    InteractiveImageZone
} from '@storylines/definitions';

const panel = defineAsyncComponent(() => import('./panel.vue'));

const props = defineProps({
    config: {
        type: Object as PropType<InteractiveImagePanel>,
        required: true
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    },
    slideIdx: {
        type: Number
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

const el = ref();
const content = ref();

const img = ref<Element>();

// Get the ID of the first (and default) panel.
const defaultPanel = props.config.panels[0];

// By default, the active config is set to the first child in the children list.
const activeConfig = ref<BasePanel>(defaultPanel.panel);
const currentDefaultImage = ref<Image>(props.config.defaultImage);
const activeImage = ref<Image | undefined>(
    props.slideIdx && props.slideIdx > 2 ? undefined : props.config.defaultImage
);
const activeIdx = ref(defaultPanel.id);
const isMobile = ref(false);

const key = getCurrentInstance()?.vnode.key as string;

const observer = ref<IntersectionObserver | undefined>(undefined);
const loaded = ref<Boolean>(false);

onUpdated(() => {
    console.log(' ');
    console.log('updating interactive image panel');
    if (!loaded.value && props.forceLoad) {
        console.log('force loading interactive image panel');
        console.log('slide idx');
        console.log(props.slideIdx);
        activeImage.value = currentDefaultImage.value;
        getCurrentInstance()?.proxy?.$forceUpdate();
        loaded.value = true;
    }
});

onMounted(() => {
    loaded.value = !props.lazyLoad; // if lazy loading is enabled, the image content will initially not be loaded
    if (props.lazyLoad && props.slideIdx && props.slideIdx > 2) {
        observer.value = new IntersectionObserver(([image]) => {
            // dont want image to be loaded a second time if it was force loaded already
            if (loaded.value) {
                console.log('closing IO for interactive image panel');
                (observer.value as IntersectionObserver).disconnect();
            }
            // lazy load images
            else if (image.isIntersecting) {
                console.log('lazy load interactive image panel');
                console.log('slide idx');
                console.log(props.slideIdx);
                activeImage.value = currentDefaultImage.value;
                getCurrentInstance()?.proxy?.$forceUpdate();
                (observer.value as IntersectionObserver).disconnect();
                loaded.value = true;
            }
        });
    }

    observer.value?.observe(img.value as Element);

    // Check for a switch from normal view to mobile view. Fixed text panel width will need to be adjusted.
    isMobile.value = window.innerWidth <= 640;
    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 640;
    });
});

const zoneClick = (zone: InteractiveImageZone): void => {
    // Find the panel.
    const panel = props.config.panels.find((el) => {
        return zone.panelId == el.id;
    });
    if (zone.imageId) {
        const image = props.config.images.find((img) => {
            return zone.imageId == img.id;
        });
        if (image) {
            activeImage.value = image;
            currentDefaultImage.value = image;
        }
    }

    // If the panel exists, switch the displayed panel.
    if (panel) {
        // Quickly reset the config so the panel component can be reset.
        activeConfig.value = {
            type: 'loading'
        };

        setTimeout(() => {
            activeConfig.value = panel.panel;
            activeIdx.value = panel.id;
        }, 10);

        setTimeout(() => {
            const elTop = el.value?.getBoundingClientRect().top;
            window.scrollTo({
                top: window.scrollY + elTop - calculateScrollOffset(),
                left: 0,
                behavior: 'smooth'
            });
        }, 50);
    }
};

const zoneMouseEnter = (zone: InteractiveImageZone): void => {
    if (zone.disableHover) {
        return;
    }
    if (zone.imageId) {
        activeImage.value =
            props.config.images.find((img) => {
                return zone.imageId == img.id;
            }) || activeImage.value;
    }
};

const zoneMouseLeave = (zone: InteractiveImageZone): void => {
    if (zone.disableHover) {
        return;
    }
    activeImage.value = currentDefaultImage.value;
};

// Calculate the scroll offset based on whether the table of contents is horizontal or vertical.
const calculateScrollOffset = (): number => {
    const isHorizontal = content.value?.$el.closest('.toc-horizontal');
    const horizontalHeight = document.getElementById('h-navbar')?.clientHeight;
    const headerHeight = document.getElementById('story-header')!.clientHeight;

    if (isHorizontal && horizontalHeight) {
        return headerHeight + horizontalHeight;
    } else {
        return headerHeight;
    }
};

/**
 * When clicking the back button, change the panel back to the default (first) panel.
 */
const clickBack = (): void => {
    activeConfig.value = {
        type: 'loading'
    };

    setTimeout(() => {
        activeConfig.value = defaultPanel.panel;
        activeIdx.value = defaultPanel.id;
        currentDefaultImage.value = props.config.defaultImage;
        activeImage.value = currentDefaultImage.value;
    }, 10);

    setTimeout(() => {
        const elTop = el.value?.getBoundingClientRect().top;
        window.scrollTo({
            top: window.scrollY + elTop - calculateScrollOffset(),
            left: 0,
            behavior: 'smooth'
        });
    }, 50);
};
</script>

<style scoped lang="scss">
.toc-horizontal {
    .return-button-container {
        top: 6.5rem;
    }
}
.toc-vertical {
    .return-button-container {
        top: 4rem;
    }
    .return-button-reversed {
        left: calc(100vw - 9rem);
    }
}

.interactive-zone {
    box-shadow: 2px 2px 10px black;
}

.return-button-container {
    position: sticky;
    text-align: right;
    z-index: 100;
    pointer-events: none;
}
.return-button {
    float: right;
    pointer-events: auto;
    background: #fff;
    box-shadow: 0px 2px 5px #000;
    width: 75px;
}
.return-button-reversed {
    float: right;
    left: calc(100vw - 6rem);
    pointer-events: auto;
    background: #fff;
    box-shadow: 0px 2px 5px #000;
    width: 75px;
}
.return-button img {
    margin: 0px;
}
.has-background {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
}

@media screen and (max-width: 640px) {
    .image-title {
        margin: 0em;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        background: #fff;
    }

    .return-button-container {
        position: sticky;
        text-align: right;
        margin-bottom: 10px;
        top: 4rem !important;
    }

    .return-button {
        position: sticky;
        opacity: 0.7;
    }

    .return-button-reversed {
        position: absolute;
        float: right;
        pointer-events: auto;
        background: #fff;
        box-shadow: 0px 2px 5px #000;
        width: 75px;
    }

    .toc-vertical .return-button-reversed {
        left: calc(100vw - 6rem);
    }

    .return-button:hover {
        opacity: 1;
    }

    .dynamic-content-text {
        display: flex;
        flex-direction: column;
    }
    .dynamic-content-media {
        display: flex;
        flex-direction: column-reverse;
    }
}
</style>
