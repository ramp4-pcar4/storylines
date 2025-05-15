<template>
    <figure class="audio-transcript flex flex-col justify-center items-center">
        <!-- audio player title, if provided. -->
        <div class="text-center font-bold">{{ props.title }}</div>

        <!-- the actual audio player -->
        <audio class="w-5/6" :src="src" controls></audio>

        <!-- Transcript section. Includes show/hide button, and the transcript if provided. If no transcript is provided, "no transcript provided" will be displayed. -->
        <figcaption>
            <div
                class="cursor-pointer text-center select-none"
                :class="!transcriptOpen ? 'transcript-closed' : 'transcript-open'"
                @click="toggleTranscript"
                @keydown.enter="toggleTranscript"
                tabindex="0"
                role="button"
                :aria-expanded="transcriptOpen"
            >
                {{ !transcriptOpen ? $t('audio.transcript.show') : $t('audio.transcript.hide') }}
            </div>
            <div class="transcript" v-if="transcriptOpen" v-html="mdContent || $t('audio.transcript.none')"></div>
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false,
        default: ''
    },
    transcript: {
        type: String,
        required: false
    }
});

const transcriptOpen = ref(false);
const toggleTranscript = () => {
    transcriptOpen.value = !transcriptOpen.value;
};

const md = new MarkdownIt({ html: true });
const mdContent = ref('');

onMounted((): void => {
    mdContent.value = md
        .render(props.transcript || '')
        .replace(/<table/g, '<div class="table-container"><table')
        .replace(/<\/table>/g, '</table></div>');

    document
        .querySelectorAll('.storyramp-app a:not([target])')
        .forEach((el: Element) => ((el as HTMLAnchorElement).target = '_blank'));
});
</script>

<style scoped>
.prose figcaption {
    @apply text-black mt-1 w-full;
}

.audio-transcript {
    @apply rounded-xl flex;
    background: #f1f3f4;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.transcript {
    @apply rounded-b-xl p-2;
    background: #fff;
}
.transcript-closed {
    @apply rounded-b-xl;
    transition: background-color 0.3s ease;
}
.transcript-open,
.transcript-closed:hover {
    @apply bg-gray-200;
}
</style>
