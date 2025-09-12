<template>
    <div class="toc-item" :class="{ flex: parentItem }">
        <!-- using router-link causes a page refresh which breaks plugin -->
        <span
            class="flex items-center px-2 py-1 mx-1 cursor-pointer"
            :class="{ 'flex-grow pb-2 min-w-0': parentItem, 'pb-2': parentItem && !verticalToc }"
            @click="scrollToChapter(getSlideId(tocItem.slideIndex))"
            @keydown.enter="scrollToChapter(getSlideId(tocItem.slideIndex))"
            tabindex="0"
            v-tippy="{
                delay: '200',
                placement: verticalToc || !parentItem ? 'right' : 'top',
                content: getTitle(tocItem),
                animateFill: true,
                animation: 'chapter-menu'
            }"
            v-if="plugin"
            role="button"
        >
            <svg
                class="flex-shrink-0"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
                stroke="#878787"
                v-if="verticalToc"
            >
                <path
                    d="m19.325 16.229c-2.4415 1.4096-4.8829 2.8191-7.3244 4.2286-2.4415-1.4096-4.883-2.8192-7.3245-4.2288-3.55e-5 -2.8191-7.1e-5 -5.6383-1.066e-4 -8.4574 2.4415-1.4096 4.8829-2.8191 7.3244-4.2286 2.4415 1.4096 4.883 2.8192 7.3245 4.2288 3.7e-5 2.8191 7.4e-5 5.6383 1.1e-4 8.4574z"
                    stroke-width=".93974"
                />
            </svg>
            <span
                class="flex-1 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap"
                :class="{ 'ml-4': verticalToc && parentItem, 'pl-8': verticalToc && !parentItem }"
                >{{ getTitle(tocItem) }}</span
            >
        </span>

        <router-link
            :to="{ hash: `#${getSlideId(tocItem.slideIndex)}`, query: route.query }"
            class="flex items-center px-2 py-1 mx-1"
            :class="{ 'flex-grow min-w-0': parentItem, 'pb-2': parentItem && !verticalToc }"
            target
            v-tippy="{
                delay: '200',
                placement: verticalToc || !parentItem ? 'right' : 'top',
                content: getTitle(tocItem),
                animateFill: true,
                animation: 'chapter-menu'
            }"
            v-else
        >
            <svg
                class="flex-shrink-0"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
                stroke="#878787"
                v-if="verticalToc"
            >
                <path
                    d="m19.325 16.229c-2.4415 1.4096-4.8829 2.8191-7.3244 4.2286-2.4415-1.4096-4.883-2.8192-7.3245-4.2288-3.55e-5 -2.8191-7.1e-5 -5.6383-1.066e-4 -8.4574 2.4415-1.4096 4.8829-2.8191 7.3244-4.2286 2.4415 1.4096 4.883 2.8192 7.3245 4.2288 3.7e-5 2.8191 7.4e-5 5.6383 1.1e-4 8.4574z"
                    stroke-width=".93974"
                />
            </svg>
            <span
                class="flex-1 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap"
                :class="{ 'ml-4': verticalToc && parentItem, 'pl-8': verticalToc && !parentItem }"
                >{{ getTitle(tocItem) }}</span
            >
        </router-link>

        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuItem, Slide } from '@storylines/definitions';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const route = useRoute();

const props = defineProps({
    tocItem: {
        type: Object as PropType<MenuItem>,
        required: true
    },
    slides: {
        type: Array as PropType<Array<Slide>>,
        required: true
    },
    parentItem: {
        type: Boolean,
        required: false,
        default: true
    },
    verticalToc: {
        type: Boolean,
        required: false,
        default: true
    },
    mobile: {
        type: Boolean,
        required: false,
        default: false
    },
    plugin: {
        type: Boolean,
        required: true
    },
    returnTop: {
        type: Boolean,
        required: false,
        default: false
    }
});

const emit = defineEmits(['scroll-to-slide']);

const scrollToChapter = (id: string): void => {
    const el = document.getElementById(id);
    if (el) {
        // Delay is needed to allow slides to force load when lazy loading is enabled
        emit('scroll-to-slide', props.tocItem.slideIndex);
        setTimeout(() => {
            const navbar = document.getElementById('h-navbar');
            const header = document.getElementById('story-header');
            const offset = navbar ? navbar.offsetHeight + header!.offsetHeight : header!.offsetHeight;
            const rect = el.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            window.scrollTo({
                top: rect.top + scrollTop - offset + 1,
                behavior: 'smooth'
            });
        }, 100);
    }
};

const getTitle = (slide: Slide | MenuItem): string => {
    return slide.title !== '' ? slide.title : t('chapters.untitled');
};

const getSlideId = (slideIdx: number): string => {
    const slide = props.slides.find((slide, idx) => idx === slideIdx);
    return slide ? `${slideIdx}-${slide.title.toLowerCase().replaceAll(' ', '-')}` : '';
};
</script>

<style lang="scss" scoped></style>
