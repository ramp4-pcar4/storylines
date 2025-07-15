<template>
    <render />
</template>

<script setup lang="ts">
/**
 * This component allows us to utilize custom Vue components inline with text content directly from the Storylines configuration file.
 * To add support for a new inline component, simply import it here and add it to the `components` object.
 */

import { defineAsyncComponent, h } from 'vue';

const props = defineProps({
    content: {
        type: String,
        required: true
    }
});

const AudioPlayer = defineAsyncComponent(() => import('./audio-widget.vue'));
const Gallery = defineAsyncComponent(() => import('./gallery-widget.vue'));
const GalleryItem = defineAsyncComponent(() => import('./gallery-item.vue'));

const render = () => {
    const r = {
        components: {
            AudioPlayer,
            Gallery,
            GalleryItem
        },
        template: `<div class="px-10 md-content object-contain">${props.content || ''}</div>`
    };

    return h(r);
};
</script>
