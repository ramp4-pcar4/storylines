<template>
    <div
        :class="isMenuOpen ? 'w-72' : ''"
        class="nav-bar sticky self-start w-12 duration-500 ease-in-out transition-width"
    >
        <div class="flex items-center mt-4 mb-12">
            <button
                class="flex items-center flex-shrink-0 px-2 py-1 mx-1 overflow-hidden"
                :aria-label="$t('chapters.menu')"
                :tabindex="isMenuOpen ? 0 : -1"
                @click="isMenuOpen = !isMenuOpen"
            >
                <svg
                    v-tippy="{
                        delay: 200,
                        placement: 'right',
                        content: $t('chapters.title'),
                        onShow: () => !isMenuOpen,
                        animateFill: true,
                        animation: 'chapter-menu'
                    }"
                    class="flex-shrink-0"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="#707070"
                >
                    <path class="transition-all duration-500 ease-in-out" :d="`m3.5 7h${isMenuOpen ? '17' : '8.5'}`" />
                    <path class="transition-all duration-500 ease-in-out" :d="`m3.5 12h${isMenuOpen ? '17' : '8.5'}`" />
                    <path d="m3.5 17h17" />
                </svg>
                <span class="flex-1 ml-4 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap">{{
                    $t('chapters.title')
                }}</span>
            </button>
        </div>
        <toc-list
            :activeChapterIndex="activeChapterIndex"
            :returnToTop="returnToTop"
            :tocType="'vertical'"
            :slides="slides"
            :isMenuOpen="isMenuOpen"
            :customToc="customToc"
            :plugin="plugin"
            @scroll-to-slide="(index) => emit('scroll-to-slide', index)"
        ></toc-list>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref, watch, onMounted } from 'vue';
import type { MenuItem, Slide } from '@storylines/definitions';
import TocList from '@storylines/components/story/toc-list.vue';

const props = defineProps({
    returnToTop: {
        type: Boolean,
        default: true
    },
    slides: {
        type: Array as PropType<Array<Slide>>,
        required: true
    },
    customToc: {
        type: Array as PropType<Array<MenuItem>>,
        required: false
    },
    activeChapterIndex: {
        type: Number,
        required: true
    },
    lang: {
        type: String,
        required: true
    },
    plugin: {
        type: Boolean,
        default: false
    }
});

const isMenuOpen = ref(false);
const emit = defineEmits(['scroll-to-slide']);
</script>

<style lang="scss" scoped>
.nav-bar {
    max-height: calc(100vh - 4rem);
    display: flex;
    flex-direction: column;
}
</style>
