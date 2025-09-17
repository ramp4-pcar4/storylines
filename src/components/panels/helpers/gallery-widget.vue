<template>
    <div
        class="storylines-gallery flex-row w-full flex flex-wrap items-center gap-2"
        ref="gallery"
        :style="{ 'max-width': props.maxWidth }"
    >
        <div v-for="(slot, idx) in children">
            <component
                :is="slot"
                @keypress.enter="onClick(idx)"
                @click="onClick(idx, true, false)"
                :size="itemSize"
            ></component>
        </div>
        <div v-if="props.caption" class="w-full text-center mt-2">
            {{ props.caption }}
        </div>
    </div>

    <!-- The pop-up component -->
    <Teleport to="body">
        <Transition name="fade">
            <div
                role="dialog"
                v-if="popupOpen"
                class="storylines-pop-up flex flex-col fixed top-0 left-0 w-full h-full p-5"
                tabindex="0"
                :id="'storylines-pop-up-modal-' + identifier"
            >
                <button
                    class="absolute top-5 right-5 bg-white p-2 w-10 h-10 cursor-pointer hover:bg-gray-200 font-bold z-10"
                    @click="closeModal"
                    @keypress.enter="closeModal"
                    tabindex="0"
                    ref="modalCloseButton"
                    v-tippy="{
                        content: $t('gallery.close'),
                        placement: 'left',
                        toggle: 'mouseenter focus click'
                    }"
                >
                    X
                </button>
                <div class="flex flex-row min-h-0 justify-center items-center select-none gap-2">
                    <!-- Slideshow left arrow-->
                    <div
                        class="nav-button"
                        tabindex="0"
                        @click="prevSlide"
                        @keypress.enter="prevSlide"
                        v-if="children.length > 1"
                        v-tippy="{
                            content: $t('gallery.previous'),
                            placement: 'right',
                            toggle: 'mouseenter focus click'
                        }"
                    >
                        <svg class="gallery-icon icon-arrowLeft" viewBox="0 0 24 24" width="24px" height="24px">
                            <path d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
                        </svg>
                    </div>
                    <component
                        :is="children[activeSlide]"
                        :isActive="true"
                        style="align-self: center; margin: 0 auto"
                        class="min-h-0"
                        @click="closeModal"
                        @keypress.esc="closeModal"
                    ></component>

                    <!-- Slideshow right arrow -->
                    <div
                        class="nav-button"
                        tabindex="0"
                        v-if="children.length > 1"
                        @click="nextSlide"
                        @keypress.enter="nextSlide"
                        v-tippy="{
                            content: $t('gallery.next'),
                            placement: 'left',
                            toggle: 'mouseenter focus click'
                        }"
                    >
                        <svg class="gallery-icon icon-arrowRight" viewBox="0 0 24 24" width="24px" height="24px">
                            <path d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                        </svg>
                    </div>
                </div>
                <!-- Thumbnails -->
                <div
                    class="flex justify-evenly items-center p-5 gap-2"
                    style="margin: 0 auto"
                    v-if="children.length > 1"
                >
                    <div
                        v-for="(entry, idx) in children"
                        :key="idx"
                        class="flex-1 thumbnail"
                        :class="{ 'active-thumbnail': activeSlide === idx }"
                    >
                        <img
                            :src="entry.props.src"
                            class="object-cover"
                            style="display: block; height: 50px; width: 50px"
                            tabindex="0"
                            @click="onClick(idx, false, false)"
                            @keypress.enter="onClick(idx, false, false)"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, Teleport, Transition, useSlots } from 'vue';

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

const identifier = Math.round(Math.random() * 1000000); // Unique identifier for the modal instance
const popupOpen = ref(false);
const activeSlide = ref(0);
const itemSize = ref(0);

const modalCloseButton = ref<HTMLElement | null>();
const gallery = ref<HTMLElement | null>();
const lastFocused = ref<HTMLElement | null>();

const slots = useSlots();
const children = computed(() => (slots.default ? slots.default() : []));

/**
 * Opens the pop-up modal and sets the active slide. Also sets focus on the modal close button for keyboard accessibility.
 * @param idx the index of the clicked image
 * @param saveFocus whether to save the last focused element before opening the modal
 * @param focusOnX whether to focus the modal close button after opening
 */
const onClick = (idx: number, saveFocus: boolean = true, focusOnX: boolean = true) => {
    // Open the modal and set the active slide to the current index.
    popupOpen.value = true;
    activeSlide.value = idx; // Set the active slide to the clicked index

    // Hide the scrollbar and save the last focused element so that we can return to it when the modal is closed.
    document.documentElement.style.overflow = 'hidden';

    if (saveFocus) lastFocused.value = document.activeElement as HTMLElement;

    document.addEventListener('keydown', initTrapFocus);

    // Set focus on the modal close button for accessibility.
    nextTick(() => {
        if (focusOnX) modalCloseButton.value?.focus();
    });
};

const nextSlide = () => {
    // Increment the active slide index and wrap around if necessary.
    activeSlide.value = (activeSlide.value + 1) % children.value.length;
};

const prevSlide = () => {
    // Decrement the active slide index and wrap around if necessary.
    activeSlide.value = (activeSlide.value - 1 + children.value.length) % children.value.length;
};

function initTrapFocus(e) {
    return trapFocus(e, `storylines-pop-up-modal-${identifier}`);
}

/**
 * Closes the modal and restores focus to the last focused element. Also re-enables scrolling on the page.
 */
const closeModal = () => {
    popupOpen.value = false;
    document.documentElement.style.overflow = 'auto';

    document.removeEventListener('keydown', initTrapFocus);

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
    const numItems = children.value.length;

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

// Stolen from https://stackoverflow.com/questions/4195616/how-to-set-the-focus-on-a-javascript-modal-window
const trapFocus = (e: KeyboardEvent, modalId: string) => {
    const isTabPressed = e.key === `Tab` || e.keyCode === 9;
    const isEscPressed = e.key === `Escape` || e.keyCode === 27;

    if (!isTabPressed) {
        if (isEscPressed) {
            closeModal();
        }
        return;
    }
    const focusableElements = `button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])`;
    const modal = document.getElementById(modalId)!;

    // get focusable elements in modal
    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
    const focusableContent = modal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];
    if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
            (lastFocusableElement as HTMLElement)!.focus();
            e.preventDefault();
        }
    } else if (document.activeElement === lastFocusableElement || !modal.contains(document.activeElement)) {
        (firstFocusableElement as HTMLElement)!.focus();
        e.preventDefault();
    }
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
.thumbnail {
    padding: 2px;
    margin: 2px;
    cursor: pointer;
}
.nav-button {
    border: 1px solid black;
    border-radius: 100%;
    background: #eee;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;
}
.active-thumbnail {
    border: 2px solid #007bff; /* Highlight active thumbnail */
    margin: 0px;
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
