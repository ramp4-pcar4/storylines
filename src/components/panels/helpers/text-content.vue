<template>
    <render />
</template>

<script setup lang="ts">
/**
 * This component allows us to utilize custom Vue components inline with text content directly from the Storylines configuration file.
 * To add support for a new inline component, simply import it here and add it to the `components` object.
 */

import { defineAsyncComponent, h, onMounted, ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const mdContent = ref('');

import type { PropType } from 'vue';
import type { ConfigFileStructure } from '@storylines/definitions';

const props = defineProps({
    content: {
        type: String,
        required: true
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    }
});

const emit = defineEmits(['rerender']);

const AudioPlayer = defineAsyncComponent(() => import('./audio-widget.vue'));
const Gallery = defineAsyncComponent(() => import('./gallery-widget.vue'));
const GalleryItem = defineAsyncComponent(() => import('./gallery-item.vue'));

onMounted(() => {
    // Adds target="_blank" to all links that don't have a target already (all internal links should have a target assigned).
    document.querySelectorAll('.storyramp-app a:not([target])').forEach((el: Element) => {
        (el as HTMLAnchorElement).target = '_blank';
    });

    // Adds a screen reader only text to links that open in a new tab.
    document.querySelectorAll('.storyramp-app a[target="_blank"]').forEach((el: Element) => {
        const innerHTML = el.innerHTML;
        if (innerHTML.includes('sr-only')) return; // Don't add it twice

        (el as HTMLAnchorElement).innerHTML = innerHTML + `<span class="sr-only"> (${t('text.newTab')})</span>`;
    });

    mdContent.value = props.content;

    // If in RESPECT preview mode, we need to do some extra Markdown rendering to display inline images in the text panel.
    if (props.configFileStructure) {
        const imagePromises: Promise<any>[] = [];

        // Creates a Promise that resolves when an image is successfully fetched from the ZIP folder.
        const _buildImagePromise = (m: RegExpMatchArray) => {
            return new Promise((resolve) => {
                // Grab the image source and alt text from the RegEx groups.
                const image = m[1];
                const altText = (m[2] !== undefined ? m[2] : m[3]) || ''; // use the alt text if it exists, default to "" if missing

                const assetSrc = `${image.substring(image.indexOf('/') + 1)}`;
                const imageFile = props.configFileStructure?.zip.file(assetSrc);
                const imageType = assetSrc.split('.').at(-1);
                if (imageFile) {
                    // Convert the image to a blob so it can be displayed locally.
                    imageFile.async(imageType === 'svg' ? 'text' : 'blob').then((res) => {
                        resolve({
                            matched: m[0],
                            alt: altText,
                            src: image,
                            blob:
                                imageType === 'svg'
                                    ? URL.createObjectURL(new Blob([res], { type: 'image/svg+xml' }))
                                    : URL.createObjectURL(res as Blob)
                        });
                    });
                } else {
                    resolve(null);
                }
            });
        };

        const extractMarkdownImages = (markdown: string) => {
            let m: RegExpExecArray | null;

            const htmlRe =
                /<img[^>]*?\s+src=["'](?!(?:https?:|data:|blob:))([^"']+)["'][^>]*?(?:\s+alt="([^"]*)"|(?:\s+alt='([^']*)')?)?/g;

            // Match local inline HTML image tags, i.e., <img src="/Test/assets/en/image.png" alt="alt">. Markdown images should have
            // been converted to HTML at this point. Ignores previously "BLOBbed" URLs.
            while ((m = htmlRe.exec(markdown)) !== null) {
                imagePromises.push(_buildImagePromise(m));
            }

            // Once the matching images resolve, replace the image source with it's newly creating BLOB URL.
            Promise.all(imagePromises).then((image) => {
                image.forEach((img) => {
                    mdContent.value = mdContent.value.replace(img.matched, `<img src="${img.blob}" alt="${img.alt}"`);
                });

                // After all images have been replaced, emit a rerender event so the parent component can perform actions as required.
                nextTick(() => {
                    emit('rerender');
                });
            });
        };

        extractMarkdownImages(mdContent.value);
    } else {
        // Text has been updated, emit a rerender event so the parent component can perform actions as required.
        nextTick(() => {
            emit('rerender');
        });
    }
});

const render = () => {
    const r = {
        components: {
            AudioPlayer,
            Gallery,
            GalleryItem
        },
        provide: {
            // Pass the configFileStructure down to the widgets. This way we don't need to include it as a prop.
            configFileStructure: props.configFileStructure
        },
        template: `<div class="px-10 md-content object-contain">${mdContent.value || ''}</div>`
    };

    return h(r);
};
</script>
