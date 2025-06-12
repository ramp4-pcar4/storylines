<template>
    <div class="sticky w-12 duration-500 ease-in-out transition-width">
        <div class="flex px-3 py-2">
            <button @click="isMenuOpen = !isMenuOpen" :aria-label="$t('chapters.menu')">
                <svg
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
            </button>
        </div>

        <div v-show="isMenuOpen" class="flex items-center mt-3 py-4 w-72 bg-white">
            <span class="flex-2 pl-2 ml-4 leading-normal">{{ $t('chapters.title') }}</span>
            <button @click="isMenuOpen = !isMenuOpen" :aria-label="$t('chapters.menu')">
                <svg
                    class="flex-shrink-0 mr-4"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#c0c0c0"
                    stroke="#c0c0c0"
                >
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
                </svg>
            </button>
        </div>

        <toc-list
            :activeChapterIndex="activeChapterIndex"
            :returnToTop="returnToTop"
            :tocType="'mobile'"
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
        type: String
    },
    plugin: {
        type: Boolean,
        default: false
    }
});

const isMenuOpen = ref(false);
const emit = defineEmits(['scroll-to-slide']);
</script>

<style lang="scss" scoped></style>
