<template>
    <div class="sticky z-10 grid-background overflow-hidden" style="top: 60px;">
        <!-- Vue3 transition for switching between a slide with no background a slide with a background. -->
        <Transition name="fade" mode="out-in">
            <div v-if="state.newImage !== 'none'" class="w-full h-full">
                <img
                    v-if="state.oldImage !== 'none'"
                    class="fade-in transition-img w-full h-full object-cover"
                    role="presentation"
                    :src="state.oldImage"
                    :alt="altText || ''"
                />
                <img
                    class="fade-in transition-img w-full h-full object-cover"
                    :class="[cssClasses, { 'transition-hide': activeImage === 1 }]"
                    :src="state.newImage"
                    :alt="altText || ''"
                    id="primaryImage"
                    role="presentation"
                />
            </div>
            <div class="w-full h-full" v-else></div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { watch, reactive, ref } from 'vue';
import type { PropType } from 'vue';
import type { ConfigFileStructure } from '@storylines/definitions';

const emit = defineEmits(['background-changed']);
const props = defineProps({
    src: {
        type: String,
        required: true
    },
    altText: {
        type: String
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    },
    cssClasses: {
        type: String
    }
});

interface BlobStore {
    [key: string]: string;
}

// Acts as a cache for images that we've already converted to a blob.
const blobStore: BlobStore = {};

const state = reactive({
    oldImage: 'none',
    newImage: 'none'
});

const activeImage = ref(0);
const activeTimeout = ref(-1);

watch(
    () => props.src,
    () => {
        // Here's how the fancy crossfade works. We have a primary image element and a secondary image element.
        // The primary element is what's displaying the current slide background, and the secondary element is only used
        // DURING a transition period.

        // When a new slide comes into view with a background applied, we display this background on the secondary component
        // whilst gradually transitioning the opacity of the primary element to 0 (triggers when `activeImage` is 1). This gives
        // us the effect of the new background smoothly coming in. Once the opacity hits 0, we move the new background image
        // to the primary element and set the opacity back to 1.
        getImageSource(props.src).then((newImage) => {
            state.oldImage = newImage;

            if (activeTimeout.value !== -1) {
                // If the source has changed while an existing transition is active, we want to restart it to prevent jumping.
                const img = document.getElementById('primaryImage');
                if (img) {
                    img.getAnimations().forEach((anim) => {
                        anim.cancel();
                        anim.play();
                    });
                }
                clearTimeout(activeTimeout.value);
                activeTimeout.value = -1;
            }

            activeImage.value = 1;

            // This is the crossfade case where we're switching between two background images.
            if (props.src !== 'none' && state.newImage !== 'none') {
                activeTimeout.value = setTimeout(() => {
                    // If the user scrolls really quickly it's possible that they're past the slide with the background.
                    // Check again to see if the slide has a background before transitioning.
                    if (props.src !== 'none') {
                        activeImage.value = 0;
                        state.oldImage = state.newImage;
                        state.newImage = newImage;
                        emit('background-changed', true);
                        activeTimeout.value = -1;
                    }
                }, 450); // timeout length is set to animation time (0.3s) plus a little bit of buffer.
            } else {
                // Not a crossfade case. We're either transitioning from nothing into an image or from an image into nothing.
                // This case uses Vue3 transitions.
                state.newImage = newImage;
                activeImage.value = 0;

                emit('background-changed', state.newImage !== 'none');
            }
        });
    },
    { immediate: false }
);

/**
 * In order to display background images in the editor preview mode. Creates a BLOB URL for each background URL the first time
 * we encounter it. In a normal Storyline, this promise will immediately resolve.
 * @param src the original image source
 */
const getImageSource = (src: string): Promise<string> => {
    return new Promise((resolve) => {
        if (src === 'none') {
            // if there is no new source then we want to transition to blank.
            resolve(src);
            return;
        }

        // If this source has already been converted to a blob, return it.
        if (blobStore[src] !== undefined) {
            resolve(blobStore[src]);
            return;
        }

        if (props.configFileStructure) {
            const assetSrc = `${src.substring(src.indexOf('/') + 1)}`;
            const imageFile = props.configFileStructure?.zip.file(assetSrc);
            const imageType = assetSrc.split('.').at(-1);
            const imageName = src.replace(/^.*[\\/]/, '');
            if (imageFile) {
                if (imageType !== 'svg') {
                    // Convert the image to a blob so it can be displayed locally.
                    imageFile.async('blob').then((res: Blob) => {
                        const blob = URL.createObjectURL(res);

                        // Assign to blobStore and return the result.
                        blobStore[src] = blob;
                        resolve(blobStore[src]);
                        return;
                    });
                } else {
                    imageFile.async('text').then((res) => {
                        const image = new File([res], imageName, { type: 'image/svg+xml' });
                        resolve(URL.createObjectURL(image));
                        return;
                    });
                }
            } else {
                resolve(src);
                return;
            }
        } else {
            fetch(src)
                .then((res) => res.blob())
                .then((blobRes) => {
                    // Convert the image to a blob so it can be displayed locally.
                    const blob = URL.createObjectURL(blobRes);

                    // Assign to blobStore and return the result.
                    blobStore[src] = blob;
                    resolve(blobStore[src]);
                    return;
                });
        }
    });
};
</script>

<style scoped>
.transition-hide {
    opacity: 0 !important;
    transition: opacity 0.4s linear;
}

.transition-img {
    position: absolute;
    opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
