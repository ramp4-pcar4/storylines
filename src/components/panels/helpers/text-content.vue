<template>
    <render />
</template>

<script setup lang="ts">
/**
 * This component allows us to utilize custom Vue components inline with text content directly from the Storylines configuration file.
 * To add support for a new inline component, simply import it here and add it to the `components` object.
 */

import { defineAsyncComponent, h, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    content: {
        type: String,
        required: true
    }
});

const AudioPlayer = defineAsyncComponent(() => import('./audio-widget.vue'));
const Gallery = defineAsyncComponent(() => import('./gallery-widget.vue'));
const GalleryItem = defineAsyncComponent(() => import('./gallery-item.vue'));

onMounted(() => {
    // Adds target="_blank" to all links that don't have a target already (all internal links should have a target assigned).
    document.querySelectorAll('.storyramp-app a:not([target])').forEach((el: Element) => {
        console.log(el);
        (el as HTMLAnchorElement).target = '_blank';
    });

    // Adds a screen reader only text to links that open in a new tab.
    document.querySelectorAll('.storyramp-app a[target="_blank"]').forEach((el: Element) => {
        const innerHTML = el.innerHTML;
        if (innerHTML.includes('sr-only')) return; // Don't add it twice

        (el as HTMLAnchorElement).innerHTML = innerHTML + `<span class="sr-only"> (${t('text.newTab')})</span>`;
    });
});

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
