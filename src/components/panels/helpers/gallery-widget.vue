<template>
    <div
        class="storylines-gallery flex-row w-full flex flex-wrap items-center gap-2 pb-5"
        ref="gallery"
        :style="{ 'max-width': props.maxWidth }"
    >
        <div v-for="(slot, idx) in $slots.default()" v-if="$slots.default">
            <component :is="slot" @keypress.enter="onClick(idx)" @click="onClick(idx)" :size="itemSize"></component>
        </div>
        <div v-if="props.caption" class="w-full text-center mt-2">
            {{ props.caption }}
        </div>
    </div>

    <!-- The pop-up component -->
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-show="popupOpen"
                @click="closeModal"
                @keypress.esc="closeModal"
                class="storylines-pop-up flex flex-col fixed top-0 left-0 w-full h-full p-10"
                tabindex="0"
                id="storylines-pop-up-modal"
            >
                <component
                    v-if="$slots.default"
                    :is="$slots.default()[activeSlide]"
                    :isActive="true"
                    style="align-self: center; margin: 0 auto"
                ></component>
                <button
                    class="absolute top-5 right-5 bg-white p-2 w-10 h-10 cursor-pointer hover:bg-gray-200 font-bold"
                    @click="closeModal"
                    @keypress.enter="closeModal"
                    tabindex="0"
                    ref="modalCloseButton"
                >
                    X
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { defineProps, nextTick, onMounted, onUnmounted, ref, Teleport, Transition, useSlots } from 'vue';

const props = defineProps({
    caption: String,
    maxPerRow: {
        // the maximum number of items per row, used to calculate item size
        type: Number,
        default: 4
    },
    maxWidth: {
        type: String,
        default: '100%'
    }
});

const popupOpen = ref(false);
const activeSlide = ref(0);
const itemSize = ref(0);

const modalCloseButton = ref<HTMLElement | null>();
const gallery = ref<HTMLElement | null>();
const lastFocused = ref<HTMLElement | null>();

const slots = useSlots();

/**
 * Opens the pop-up modal and sets the active slide. Also sets focus on the modal close button for keyboard accessibility.
 * @param idx the index of the clicked image
 */
const onClick = (idx: number) => {
    // TODO: The lines below are currently unused, but will likely be useful for the slideshow.
    // const itemEl = slots.default()[idx];

    // Open the modal and set the active slide to the current index.
    popupOpen.value = !popupOpen.value;
    activeSlide.value = idx; // Set the active slide to the clicked index

    // Hide the scrollbar and save the last focused element so that we can return to it when the modal is closed.
    if (popupOpen.value) {
        document.documentElement.style.overflow = 'hidden';
        lastFocused.value = document.activeElement as HTMLElement;

        // Set focus on the modal close button for accessibility.
        nextTick(() => {
            modalCloseButton.value?.focus();
        });
    }
};

/**
 * Closes the modal and restores focus to the last focused element. Also re-enables scrolling on the page.
 */
const closeModal = () => {
    popupOpen.value = false;
    document.documentElement.style.overflow = 'auto';

    // Restore focus to the last focused element.
    nextTick(() => {
        lastFocused.value?.focus();
    });
};

/**
 * Calculates the size of each gallery item based on the width of the gallery container.
 */
const calculateItemSize = () => {
    const galleryWidth: number = gallery.value!.clientWidth - 16;
    const numItems = slots.default().length;

    let idealPerRow; // Ideal number of items per row
    let numberPerRow; // Actual number of items per row

    if (galleryWidth <= 150) {
        idealPerRow = 1;
    } else if (galleryWidth <= 300) {
        idealPerRow = 2;
    } else if (galleryWidth <= 600) {
        idealPerRow = 3;
    } else {
        idealPerRow = 4;
    }

    numberPerRow = Math.min(numItems, Math.min(idealPerRow, props.maxPerRow));

    itemSize.value = (galleryWidth - 8 * numberPerRow) / numberPerRow; // `gap-2` adds 8px of space between items, consider this
};

onMounted(() => {
    window.addEventListener('resize', calculateItemSize);
    calculateItemSize();
});

onUnmounted(() => {
    window.removeEventListener('resize', calculateItemSize);
});
</script>

<style scoped>
.storylines-gallery {
    max-width: 55vw;
    align-items: center;
    margin: 0 auto;
}
.storylines-pop-up {
    z-index: 100;
    background: rgba(255, 255, 255, 1);
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
