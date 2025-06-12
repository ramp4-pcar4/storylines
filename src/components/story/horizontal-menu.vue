<template>
    <div id="h-navbar" class="navbar h-11 sticky">
        <toc-list
            :activeChapterIndex="activeChapterIndex"
            :returnToTop="returnToTop"
            :tocType="'horizontal'"
            :slides="slides"
            :customToc="customToc"
            :plugin="plugin"
            @scroll-to-slide="(index) => emit('scroll-to-slide', index)"
        ></toc-list>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
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

const emit = defineEmits(['scroll-to-slide']);
</script>

<style lang="scss" scoped>
.navbar {
    background-color: rgb(241, 242, 244);
    border-bottom: 2px;
    border-color: rgba(229, 231, 235, var(--tw-border-opacity));
    position: sticky;
    width: 100%;
    margin: 0;
    display: flex;
    justify-content: center;
}
</style>
