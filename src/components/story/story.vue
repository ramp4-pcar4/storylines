<template>
    <!-- If the configuration file is being fetched, display a spinner to indicate loading. -->
    <div v-if="loadStatus === 'loading'">
        <div class="block py-20 align-middle text-center h-full" style="margin: 0 auto">
            <VueSpinnerOval size="120px" color="#009cd1" style="margin: 0 auto"></VueSpinnerOval>
        </div>
    </div>

    <div v-else-if="loadStatus === 'error'">
        <div class="block py-20 align-middle text-center h-full" style="margin: 0 auto">
            <div style="font-size: 200px">!</div>
            <div>
                {{ $t('story.error') }}
            </div>
        </div>
    </div>

    <div v-else-if="loadStatus === 'loaded'">
        <div class="storyramp-app bg-white" v-if="config !== undefined" id="top">
            <header
                id="story-header"
                class="story-header sticky top-0 w-full h-16 leading-9 bg-white border-b border-gray-200"
            >
                <div class="flex w-full sm:px-6 py-3 mx-auto">
                    <mobile-menu
                        class="mobile-menu"
                        :active-chapter-index="activeChapterIndex"
                        :return-to-top="config.returnTop ?? true"
                        :customToc="config.tableOfContents"
                        :slides="config.slides"
                        @scroll-to-slide="setTargetIndex"
                        :lang="lang"
                    />
                    <div class="flex-none w-mobile-full truncate">
                        <button
                            class="text-lg font-semibold hover:underline"
                            @click="scrollToTop"
                            v-tippy="{
                                delay: '200',
                                placement: 'right',
                                content: $t('chapters.return'),
                                animateFill: true
                            }"
                        >
                            {{ config.title }}
                        </button>
                    </div>
                    <div class="flex justify-end flex-auto space-x-6">
                        <!-- Any links we want in the header can go here -->
                    </div>
                </div>
            </header>

            <intro :config="config.introSlide"></intro>

            <div class="w-full mx-auto pb-10 mb-6" id="story">
                <story-content
                    :config="config"
                    :lang="lang"
                    :headerHeight="headerHeight"
                    @step="updateActiveIndex"
                    :targetIndex="targetIndex"
                />
            </div>

            <footer class="p-8 pt-2 text-right text-sm">
                Context:
                <a class="text-blue-700 font-semibold" :href="config.contextLink" target="_NEW">{{
                    config.contextLabel
                }}</a>
                |
                <a href="https://github.com/ramp4-pcar4/storylines" target="_NEW" class="font-semibold text-blue-700"
                    >ramp4-pcar4/storylines</a
                >
            </footer>

            <div class="storyramp-modified" v-if="config.dateModified">
                {{ $t('story.date') }}
                {{ config.dateModified }}
            </div>
            <div class="footer-padding" v-if="footerPadding" :style="footerPaddingStyle"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, type RouteLocationNormalized } from 'vue-router';

import MobileMenu from './mobile-menu.vue';
import StoryContent from '@storylines/components/story/story-content.vue';
import Intro from '@storylines/components/story/introduction.vue';

import type { StoryRampConfig } from '@storylines/definitions';
import { VueSpinnerOval } from 'vue3-spinners';
import { EventBus } from '../../event-bus';

const route = useRoute();

const footerPadding = computed(
    () => !window.location.href.includes('index-ca-en.html') && !window.location.href.includes('index-ca-fr.html')
);

const footerPaddingStyle = computed(() => {
    measure();
    const h = `calc(100dvh - ${lastSlideHeight.value + extraHeight.value}px)`;
    return { height: h };
});

const config = ref<StoryRampConfig | undefined>(undefined);
const loadStatus = ref('loading');
const activeChapterIndex = ref(-1);
const targetIndex = ref(-1);
const headerHeight = ref(0);
const lang = ref('en');
const lastSlideHeight = ref(0);
const extraHeight = ref(0);

function measure(): void {
    const nav = document.getElementById('h-navbar');
    const header = document.getElementById('story-header');
    extraHeight.value = nav ? nav.offsetHeight : 0; //horizontal navbar
    extraHeight.value += header ? header.offsetHeight : 0; //header
    extraHeight.value += 64 + 56 + 60 - 3; //bottom padding of story, context in footer, date modified, some extra padding
}

onMounted(() => {
    window.addEventListener('resize', measure);
    EventBus.on('scroll-to-slide', (params) => {
        setTargetIndex(+params.slideIndex);
    });
    const uid = route.params.uid as string;
    lang.value = (route.params.lang as string) ? (route.params.lang as string) : 'en';
    if (uid) {
        fetchConfig(uid, lang.value);
    } else {
        console.error(`Please supply the language and id URL params in the form of /[lang]/[uid].`);
        // if no URL params have been provided redirect to canada.ca 404 page
        window.location.href = 'https://www.canada.ca/errors/404.html';
    }

    // set page lang
    const html = document.documentElement; // returns the html tag
    html.setAttribute('lang', lang.value);
    const instance = getCurrentInstance();
    if (instance?.proxy?.$i18n) {
        instance.proxy.$i18n.locale = lang.value;
    }
});

onBeforeUnmount(() => {
    measureNav();
    EventBus.off('scroll-to-slide', (params) => {
        setTargetIndex(+params.slideIndex);
    });
});

// react to param changes in URL
// eslint-disable-next-line
const beforeRouteUpdate = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: () => void): void => {
    const uid = to.params.uid as string;
    lang.value = to.params.lang as string;
    const instance = getCurrentInstance();
    if (instance?.proxy?.$i18n) {
        instance.proxy.$i18n.locale = lang.value;
    }
    fetchConfig(uid, lang.value);
    next();
};

const setTargetIndex = (index: number) => {
    targetIndex.value = index;
};

/**
 * Scrolls the user back to the top of the page when they click on the product title.
 */
const scrollToTop = () => {
    const intro = document.getElementById('top');
    intro?.scrollIntoView({ behavior: 'smooth' });
};

const fetchConfig = (uid: string, lang: string): void => {
    fetch(`${uid}/${uid}_${lang}.json`)
        .then((res) => {
            res.json()
                .then((configs: StoryRampConfig) => {
                    config.value = configs;
                    loadStatus.value = 'loaded';
                    // set page title
                    if (config.value) {
                        document.title = config.value.title + ' - Canada.ca';
                        // Purge undefined slides for viewing, otherwise storyline will crash
                        config.value.slides = config.value.slides.filter((slide) => slide && Object.keys(slide).length);
                    }
                    // add stylesheets to the page, we want this to happen ASAP
                    if (config.value.stylesheets) {
                        addStylesheets(config.value.stylesheets);
                    }

                    // We fire this event when the config has loaded to let the host page know it has access to the config.
                    const loadEvent = new CustomEvent('Storylines-Loaded', {
                        detail: {
                            config: config.value
                        }
                    });

                    document.dispatchEvent(loadEvent);
                })
                .catch(() => {
                    // An error occurred while trying to convert the reponse to JSON. Most likely case for this to occur is
                    // if the file doesn't exist and the server returns HTML. Redirect to the 404 page.
                    window.location.href = 'https://www.canada.ca/errors/404.html';
                });
        })
        .catch((err) => {
            if (err.code === 'MODULE_NOT_FOUND') {
                console.error(`There exists no config given by the URL params: ${err}`);
                // redirect to canada.ca 404 page on invalid URL params
                window.location.href = 'https://www.canada.ca/errors/404.html';
            } else {
                // Some unknown error, possibly a build error that could indicate an error in the
                // configuration file.
                loadStatus.value = 'error';

                // Print out the error stack.
                console.error(err.stack);
            }
        });
};

const addStylesheets = (paths: string[]): void => {
    paths.forEach((path) => {
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', path);
        document.head.appendChild(styleLink);
    });
};

const updateActiveIndex = (idx: number): void => {
    activeChapterIndex.value = idx;
    // determine header height
    const headerH = document.getElementById('story-header');
    if (headerH) {
        headerHeight.value = headerH.clientHeight;
    }
    const slides = document.querySelectorAll('.story-slide');
    const lastSlide = slides[slides.length - 1] as HTMLElement;
    if (lastSlide) {
        lastSlideHeight.value = lastSlide.offsetHeight;
    }
};
</script>

<style lang="scss">
$font-list: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

.storyramp-app {
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
        line-height: 1.65em;
        border-bottom: 0px;
    }

    .storyramp-modified {
        max-width: 1536px;
        margin: 0 auto;
        padding-left: 15px;
        padding-top: 1em;
        padding-bottom: 1em;
    }

    .prose {
        line-height: 1.65em;
    }

    .prose a {
        font-weight: bold;
    }

    .prose a:not([panel]):not([target='_self'])::after {
        content: url('../../assets/popout.svg');
        display: inline-block;
        margin-left: 0.2em;
        height: 1em;
        width: 1em;
        text-align: center;
    }

    .w-mobile-full {
        width: 80%;
    }
}

.story-header {
    z-index: 60;
}

@media screen and (min-width: 640px) {
    .mobile-menu {
        display: none !important;
    }
    .w-mobile-full {
        width: 100% !important;
    }
}
</style>
