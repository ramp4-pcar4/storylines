<template>
    <scrollama
        class="text-panel prose max-w-none mb-5 mx-1 py-5"
        :class="{ 'has-background': background }"
        :style="{ color: config.textColour ?? '#000'}"
    >
        <component v-if="config.title" :is="config.titleTag || 'h2'" class="px-10 mb-0 chapter-title top-20">
            {{ config.title }}
        </component>

        <TextContent :content="mdContent"></TextContent>
    </scrollama>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { TextPanel } from '@storylines/definitions';

import MarkdownIt from 'markdown-it';
import Scrollama from './helpers/scrollama.vue';

const TextContent = defineAsyncComponent(() => import('./helpers/text-content.vue'));

const props = defineProps({
    config: {
        type: Object as PropType<TextPanel>,
        required: true
    },
    background: {
        type: Boolean
    }
});

const md = new MarkdownIt({ html: true, breaks: true });
const mdContent = ref('');

onMounted((): void => {
    mdContent.value = md
        .render(props.config.content)
        .replace(/<table/g, '<div class="table-container"><table')
        .replace(/<\/table>/g, '</table></div>');

    document
        .querySelectorAll('.storyramp-app a:not([target])')
        .forEach((el: Element) => ((el as HTMLAnchorElement).target = '_blank'));
});
</script>

<style scoped lang="scss">
.has-background {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
}

@media screen and (max-width: 640px) {
    .chapter-title {
        max-width: 100vw;
    }

    .text-panel {
        margin-top: 1rem;
    }

    .md-content {
        max-width: 100vw;

        :deep(.table-container) {
            overflow-x: auto;
        }
    }
}
</style>
