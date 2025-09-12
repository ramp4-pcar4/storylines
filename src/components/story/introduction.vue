<template>
    <div class="intro-grid items-center">
        <div class="intro-background shadow-md w-full h-full" v-if="state.backgroundImage">
            <img :src="state.backgroundImage" class="h-full w-full object-cover" alt="" role="presentation" />
        </div>
        <div class="py-24 text-center intro-content" id="intro">
            <img v-if="!!state.logo" class="inline-block" :src="state.logo" :alt="config.logo.altText" />

            <h1 class="m-10 text-5xl font-bold" :style="{ color: config.titleColour ?? '#1f2937' }">
                {{ config.title }}
            </h1>
            <p class="w-1/2 m-auto text-2xl font-semibold" :style="{ color: config.subtitleColour ?? '#6b7280' }">
                {{ config.subtitle }}
            </p>

            <!-- using router-link causes a page refresh which breaks plugin -->
            <button
                class="inline-block mt-10 scroll-arrow"
                @click="scrollToStory"
                v-if="!!configFileStructure || !!plugin"
            >
                <svg
                    class="w-auto h-24 m-auto"
                    width="90"
                    height="104.84"
                    viewBox="0 0 90 104.83"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="m89.51 77.659-44.51 25.698-44.51-25.698 3.86e-4 -51.395 44.51-25.698 44.51 25.698z"
                        fill="none"
                        :stroke="config.buttonColour ?? '#00d2d3'"
                        stroke-dasharray="4.8960465, 4.8960465"
                        stroke-dashoffset="2.7"
                        stroke-width=".5"
                    />
                    <path
                        d="m45 104.27-44.51-25.697v-10.646l44.51 25.697 44.51-25.697v10.646z"
                        :fill="config.buttonColour ?? '#00d2d3'"
                        :stroke="config.buttonColour ?? '#00d2d3'"
                        stroke-width=".97921"
                    />
                </svg>
            </button>

            <router-link
                :to="{ hash: '#story', query: route.query }"
                class="inline-block mt-10 scroll-arrow"
                :title="$t('intro.scrollToStory')"
                target
                v-else
            >
                <svg
                    class="w-auto h-24 m-auto"
                    width="90"
                    height="104.84"
                    viewBox="0 0 90 104.83"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="m89.51 77.659-44.51 25.698-44.51-25.698 3.86e-4 -51.395 44.51-25.698 44.51 25.698z"
                        fill="none"
                        :stroke="config.buttonColour ?? '#00d2d3'"
                        stroke-dasharray="4.8960465, 4.8960465"
                        stroke-dashoffset="2.7"
                        stroke-width=".5"
                    />
                    <path
                        d="m45 104.27-44.51-25.697v-10.646l44.51 25.697 44.51-25.697v10.646z"
                        :fill="config.buttonColour ?? '#00d2d3'"
                        :stroke="config.buttonColour ?? '#00d2d3'"
                        stroke-width=".97921"
                    />
                </svg>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { ConfigFileStructure, Intro } from '@storylines/definitions';

const route = useRoute();

const props = defineProps({
    config: {
        type: Object as PropType<Intro>,
        required: true
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    },
    plugin: {
        type: Boolean
    }
});

const state = reactive({
    logo: '',
    backgroundImage: ''
});

onMounted(() => {
    state.logo = props.config.logo ? props.config.logo.src : '';
    state.backgroundImage = props.config.backgroundImage ?? '';
    // obtain logo and background image from ZIP file if it exists
    if (props.configFileStructure) {
        const logo = props.config.logo?.src;
        const background = props.config.backgroundImage;

        if (logo) {
            const logoSrc = `${logo.substring(logo.indexOf('/') + 1)}`;
            const logoFile = props.configFileStructure.zip.file(logoSrc);
            const logoType = logoSrc.split('.').at(-1);
            const logoName = logo.replace(/^.*[\\/]/, '');
            if (logoFile) {
                if (logoType !== 'svg') {
                    logoFile.async('blob').then((res: Blob) => {
                        state.logo = props.config.logo.src = URL.createObjectURL(res);
                    });
                } else {
                    logoFile.async('text').then((res) => {
                        const image = new File([res], logoName, { type: 'image/svg+xml' });
                        state.logo = props.config.logo.src = URL.createObjectURL(image);
                    });
                }
            }
        }

        if (background) {
            const bgSrc = `${background.substring(background.indexOf('/') + 1)}`;
            const bgFile = props.configFileStructure.zip.file(bgSrc);
            const bgType = bgSrc.split('.').at(-1);
            const bgName = logo.replace(/^.*[\\/]/, '');
            if (bgFile) {
                if (bgType !== 'svg') {
                    bgFile.async('blob').then((res: Blob) => {
                        state.backgroundImage = props.config.backgroundImage = URL.createObjectURL(res);
                    });
                } else {
                    bgFile.async('blob').then((res: Blob) => {
                        const image = new File([res], bgName, { type: 'image/svg+xml' });
                        state.backgroundImage = props.config.backgroundImage = URL.createObjectURL(image);
                    });
                }
            }
        }
    }
});

const scrollToStory = (): void => {
    const el = document.getElementById('story');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
};
</script>

<style lang="scss">
.intro-grid {
    display: grid;
    grid-template-areas: 'introductionGrid';
}
.intro-content {
    grid-area: introductionGrid;
}
.intro-background {
    grid-area: introductionGrid;
    background: var(--sr-content-background);

    border-style: solid none solid solid;
    border-width: 1px 0 1px 1px;

    // border-gray-200
    border-color: var(--sr-border-colour);
    max-height: calc(100vh - 4rem);
    min-height: 100%;
}
</style>
