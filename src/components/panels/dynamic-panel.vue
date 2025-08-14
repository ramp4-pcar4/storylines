<template>
    <div
        ref="el"
        :id="key"
        class="story-slide w-full h-full flex flex-col"
        :class="!!config.reversed ? 'sm:flex-row-reverse' : 'sm:flex-row'"
    >
        <scrollama
            class="dynamic-content-slide order-2 sm:order-1 prose max-w-none min-w-0 mb-5 mx-1 py-5"
            :class="{ 'has-background': background, 'flex-1': !!config.contentWidth === false }"
            :style="{
                color: config.textColour ?? '#000',
                width: !isMobile ? `${config.contentWidth}` : undefined
            }"
        >
            <component
                :is="config.titleTag || 'h2'"
                class="px-10 mb-0 chapter-title top-20"
                :style="activeIdx !== defaultPanel.id ? 'margin-top: 0px;' : ''"
            >
                {{ config.title }}
            </component>

            <div class="px-10 md-content" v-html="md.render(config.content)"></div>
        </scrollama>

        <div
            :class="
                activeConfig.type !== 'text'
                    ? `sticky top-0 sm:self-start flex-2 order-1 sm:order-2 z-40 dynamic-content-media sm:flex-col min-w-0`
                    : 'flex-2 order-2 sm:order-1 dynamic-content-text'
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
import { defineAsyncComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { BasePanel, ConfigFileStructure, DynamicPanel } from '@storylines/definitions';

import MarkdownIt from 'markdown-it';
import Scrollama from './helpers/scrollama.vue';

const panel = defineAsyncComponent(() => import('./panel.vue'));

const props = defineProps({
    config: {
        type: Object as PropType<DynamicPanel>,
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
    }
});

const el = ref();
const content = ref();

// Get the ID of the first or default panel.
const defaultPanel = (() => {
    const firstPanel = props.config.children?.[0];
    return firstPanel ?? { id: 'default-panel', panel: <BasePanel>{ type: 'text', title: '', content: '' } };
})();

// By default, the active config is set to the first child in the children list.
const activeConfig = ref<BasePanel>(defaultPanel.panel);
const activeIdx = ref(defaultPanel.id);
const isMobile = ref(false);

const md = new MarkdownIt({ html: true, breaks: true });

const key = getCurrentInstance()?.vnode.key as string;

onMounted(() => {
    document
        .querySelectorAll('.storyramp-app a:not([target])')
        .forEach((el: Element) => ((el as HTMLAnchorElement).target = '_blank'));

    addDynamicURLs();

    // Check for a switch from normal view to mobile view. Fixed text panel width will need to be adjusted.
    isMobile.value = window.innerWidth <= 640;
    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 640;
    });
});

/**
 * Adds panel-switching functionality to URLs.
 */
const addDynamicURLs = (): void => {
    // Find all URLs that contain the `panel` attribute.
    const urls: HTMLAnchorElement[] = Array.from(el.value.querySelectorAll('a[panel]'));
    urls.forEach((el: HTMLAnchorElement) => {
        // Find the target panel and add an event listener to the URL.
        const target = el.attributes.getNamedItem('panel')?.value;

        // Change the target to self so clicking the link doesn't open in a new window. Also add a
        // dotted underline to indicate that clicking this link will stay in this window.
        el.style.setProperty('text-decoration-style', 'dotted');
        el.style.setProperty('text-underline-offset', '3px');
        el.href = 'javascript:;';
        el.target = '_self';

        el.onclick = () => {
            // Find the panel.
            const panel = props.config.children.find((el) => {
                return target == el.id;
            });

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
                    const elTop = content.value?.$el.getBoundingClientRect().top;
                    window.scrollTo({
                        top: window.scrollY + elTop - calculateScrollOffset(),
                        left: 0,
                        behavior: 'smooth'
                    });
                }, 50);
            }
        };
    });
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
    }, 10);

    setTimeout(() => {
        const elTop = content.value?.$el.getBoundingClientRect().top;
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
    .dynamic-content-slide {
        max-width: 96vw; // cap out the width of the content slide in mobile mode to prevent horizontal scroll
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
