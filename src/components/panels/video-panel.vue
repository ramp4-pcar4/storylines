<template>
    <div
        class="video-container self-start justify-center flex flex-col h-full align-middle pb-5 w-full"
        :style="{
            width: config.width ? `${config.width}` : '100%'
        }"
    >
        <!-- YouTube video -->
        <template v-if="config.videoType === 'YouTube'">
            <iframe
                class="media-player"
                :title="config.title"
                :src="config.src"
                :height="config.height ? `${config.height}` : '500px'"
                allowfullscreen
            ></iframe>
        </template>

        <!-- video with local/external source -->
        <template v-if="config.videoType === 'local' || config.videoType === 'external'">
            <video
                class="media-player"
                ref="vid"
                :src="videoBlobSrc ? videoBlobSrc : undefined"
                :title="config.title"
                :height="config.height ? `${config.height}` : '500px'"
                :poster="config.thumbnailUrl"
                :autoplay="config.autoplay"
                :muted="config.autoplay"
                controls
            >
                <source v-if="!videoBlobSrc" :type="fileType" :src="videoBlobSrc ? videoBlobSrc : config.src" />
                <!-- add captions with transcript -->
                <track
                    kind="captions"
                    :src="captionsBlobSrc ? captionsBlobSrc : config.caption"
                    :srclang="lang"
                    :label="langs[lang]"
                    v-if="config.caption"
                />
            </video>
        </template>

        <!-- title of the video with transcript -->
        <figure>
            <figcaption class="bg-gray-200 rounded">
                <button
                    class="flex w-full items-center justify-between p-4"
                    :class="{
                        'hover:bg-gray-300': config.transcript,
                        'cursor-pointer': config.transcript,
                        'pointer-events-none': !transcriptContent
                    }"
                    @click="toggleTranscript()"
                >
                    <span class="font-semibold"
                        >{{ config.title }} <span v-if="config.transcript">({{ $t('video.transcript') }})</span></span
                    >
                    <div class="float-right" v-if="config.transcript">
                        <svg v-if="expandTranscript" class="h-6 w-6">
                            <g id="chevron-down">
                                <path
                                    d="M 7.41348,8.58407L 11.9995,13.1701L 16.5855,8.58407L 17.9995,9.99807L 11.9995,15.9981L 5.99948,9.99807L 7.41348,8.58407 Z "
                                />
                            </g>
                        </svg>
                        <svg v-else class="h-6 w-6">
                            <g id="chevron-up">
                                <path
                                    d="M 7.41351,15.4121L 11.9995,10.8261L 16.5855,15.4121L 17.9995,13.9981L 11.9995,7.99807L 5.99951,13.9981L 7.41351,15.4121 Z "
                                />
                            </g>
                        </svg>
                    </div>
                </button>
                <div class="content border border-gray-300 p-4" v-show="expandTranscript">
                    <div v-html="transcriptContent"></div>
                </div>
            </figcaption>
        </figure>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { ConfigFileStructure, VideoPanel } from '@storylines/definitions';
import { onBeforeMount, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import { useRoute } from 'vue-router';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true });
const route = useRoute();

const props = defineProps({
    config: {
        type: Object as PropType<VideoPanel>,
        required: true
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    },
    slideIdx: {
        type: Number,
        default: 0
    },
    lazyLoad: {
        type: Boolean
    },
    forceLoad: {
        type: Boolean
    }
});

const lang = ref('en');
const langs = ref<Record<string, string>>({ en: 'English', fr: 'French' });

const videoBlobSrc = ref('');
const captionsBlobSrc = ref('');
const fileType = ref('');
const expandTranscript = ref(false);

const rawTranscript = ref('');
const transcriptContent = ref('');

const vid = ref<HTMLVideoElement>();
const observer = ref<IntersectionObserver | undefined>(undefined);
const loaded = ref<Boolean>(false);

onBeforeMount(() => {
    lang.value = (route?.params.lang as string) ? (route?.params.lang as string) : 'en';

    // find file type extension for non-YT videos
    if (props.config.videoType === 'external' || props.config.videoType === 'local') {
        const ext = extensionType(props.config.src);
        fileType.value = `video/${ext}`;
    }
});

onUpdated(() => {
    console.log('updating video panel');
    console.log('slide idx');
    console.log(props.slideIdx);
    if (!loaded.value && vid.value && props.forceLoad) {
        console.log('force load video panel');
        vid.value.load();
        loaded.value = true;
    }
});

onMounted(() => {
    loaded.value = !props.lazyLoad; // if lazy loading is enabled, the video content will initially not be loaded
    // lazy load videos
    if (props.lazyLoad && props.slideIdx > 2) {
        observer.value = new IntersectionObserver(([video]) => {
            // dont want video to be loaded a second time if it was force loaded already
            if (loaded.value) {
                console.log('closing IO for video panel');
                (observer.value as IntersectionObserver).disconnect();
            } else if (video.isIntersecting) {
                console.log('lazy load video panel');
                console.log('slide idx');
                console.log(props.slideIdx);
                vid.value?.load();
                (observer.value as IntersectionObserver).disconnect();
                loaded.value = true;
            }
        });
    }

    if (props.configFileStructure) {
        // get video file from config file structure
        if (props.config.videoType === 'local') {
            extractBlobFile(`${props.config.src.substring(props.config.src.indexOf('/') + 1)}`, 'video');
        }
        // get captions file from config file structure
        if (props.config.caption) {
            extractBlobFile(`${props.config.caption.substring(props.config.caption.indexOf('/') + 1)}`, 'captions');
        }
        // get transcript file from config file structure
        if (props.config.transcript) {
            extractBlobFile(
                `${props.config.transcript.substring(props.config.transcript.indexOf('/') + 1)}`,
                'transcript'
            );
        }
    } else {
        // fetch and config transcript content and render with md
        if (props.config.transcript) {
            const ext = extensionType(props.config.transcript);

            fetch(props.config.transcript).then((res: Response) => {
                res.text().then((content: string) => {
                    rawTranscript.value = content;
                    // can be HTML or MD format
                    transcriptContent.value = ext === 'md' ? md.render(rawTranscript.value) : rawTranscript.value;
                });
            });
        }
    }

    if (vid.value) {
        observer.value?.observe(vid.value as HTMLVideoElement);
    }
});

onBeforeUnmount(() => {
    if (observer.value) {
        (observer.value as IntersectionObserver).disconnect();
    }
});

const extractBlobFile = (src: string, type?: string): void => {
    const assetFile = props.configFileStructure?.zip.file(src);
    if (assetFile) {
        assetFile.async('blob').then((res: Blob) => {
            if (type === 'video') {
                const videoBlob = new Blob([res], { type: 'video/mp4' });
                videoBlobSrc.value = URL.createObjectURL(videoBlob);
            } else if (type === 'transcript') {
                res.text().then((content: string) => {
                    rawTranscript.value = content;
                    // can be HTML or MD format
                    transcriptContent.value = rawTranscript.value;
                });
            } else {
                captionsBlobSrc.value = URL.createObjectURL(res);
            }
        });
    }
};

const toggleTranscript = (): void => {
    expandTranscript.value = !expandTranscript.value;
};

const extensionType = (file: string): string | undefined => {
    const fileName = file.substring(file.lastIndexOf('/') + 1);
    return fileName.split('.').pop();
};
</script>

<style lang="scss">
@media screen and (max-width: 640px) {
    .video-container {
        min-width: 100%;
        background-color: white;
    }
    .media-player {
        max-height: 40vh;
    }
}

.video-container {
    margin: 0 auto;
    max-width: 100vw;
}

.media-player {
    aspect-ratio: 16/9;
    width: 100%;
    height: 100%;
}

.float-right {
    justify-self: flex-end;
    margin-left: auto;
}
</style>
