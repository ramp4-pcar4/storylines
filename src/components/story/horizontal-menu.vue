<template>
    <div id="h-navbar" class="navbar h-11 sticky">
        <ul>
            <li v-if="introExists && returnToTop">
                <a
                    class="flex items-center px-2 py-1 mx-1 cursor-pointer"
                    @click="scrollToChapter('intro')"
                    v-tippy="{
                        delay: '200',
                        placement: 'bottom',
                        content: $t('chapters.return'),
                        animateFill: true,
                        animation: 'chapter-menu'
                    }"
                    v-if="plugin"
                >
                    <span class="flex-1 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap">{{
                        $t('chapters.return')
                    }}</span>
                </a>

                <router-link
                    :to="{ hash: '#intro' }"
                    class="flex items-center px-2 py-1 mx-1"
                    target
                    v-tippy="{
                        delay: '200',
                        placement: 'bottom',
                        content: $t('chapters.return'),
                        animateFill: true,
                        animation: 'chapter-menu'
                    }"
                    v-else
                >
                    <span class="flex-1 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap">{{
                        $t('chapters.return')
                    }}</span>
                </router-link>
            </li>

            <!-- Build custom configured table of contents -->
            <template v-if="customToc">
                <li
                    v-for="(item, idx) in customToc"
                    :key="idx"
                    :class="{
                        'is-active': lastActiveIdx === item.slideIndex || isSublistActive(item.sublist),
                        separator: (!returnToTop && idx !== 0) || returnToTop
                    }"
                    ref="itemContainer"
                    @focusout="handleFocus(idx)"
                >
                    <toc-item
                        :tocItem="item"
                        :slides="slides"
                        :verticalToc="false"
                        :plugin="plugin"
                        @scroll-to-slide="scrollToTarget"
                    >
                        <button
                            class="mr-1"
                            :aria-label="$t('chapters.menu.dropdown')"
                            v-if="item.sublist && item.sublist.length"
                            @click="toggleSublist(idx)"
                        >
                            <svg
                                data-v-b1261e08=""
                                xmlns="http://www.w3.org/2000/svg"
                                height="18"
                                viewBox="0 0 24 24"
                                width="18"
                                :class="{ 'rotate-180': sublistToggled === idx }"
                            >
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                            </svg>
                        </button>
                    </toc-item>

                    <!-- Dropdown for sublists -->
                    <ul v-show="sublistToggled === idx" class="sublist-menu mt-1">
                        <li
                            v-for="(subItem, subIdx) in item.sublist"
                            :key="subIdx"
                            :class="[
                                {
                                    'border-t-2': subIdx !== 0,
                                    'is-active': lastActiveIdx === subItem.slideIndex
                                }
                            ]"
                            class="border-gray-300"
                        >
                            <toc-item
                                :tocItem="subItem"
                                :slides="slides"
                                :parentItem="false"
                                :verticalToc="false"
                                :plugin="plugin"
                                @scroll-to-slide="scrollToTarget"
                            ></toc-item>
                        </li>
                    </ul>
                </li>
            </template>

            <!-- Default table of contents -->
            <template v-else>
                <li
                    v-for="(slide, idx) in tocSlides"
                    :key="idx"
                    :class="{
                        'is-active': lastActiveIdx === slide.index,
                        separator: (!returnToTop && idx !== 0) || returnToTop
                    }"
                >
                    <toc-item
                        :tocItem="{ ...slide, slideIndex: slide.index }"
                        :slides="slides"
                        :verticalToc="false"
                        :plugin="plugin"
                        @scroll-to-slide="scrollToTarget"
                    ></toc-item>
                </li>
            </template>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import type { MenuItem, Slide } from '@storylines/definitions';
import TocItem from '@storylines/components/panels/helpers/toc-item.vue';

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

const introExists = ref(false);
const lastActiveIdx = ref(-1);

const sublistToggled = ref<number>(-1);
const itemContainer = ref(null);

const emit = defineEmits(['scroll-to-slide']);

// filter out which slides are visible in the table of contents while preserving original slide index
const tocSlides = computed(() => {
    let slides = props.slides.map((slide, idx) => ({ ...slide, index: idx }));
    slides = slides.filter((slide) => slide.includeInToc !== false);
    return slides;
});

const customTocSlides = computed(() => {
    if (props.customToc) {
        // for custom ToC extract slides including nested sublist items
        let slides: MenuItem[] = [];
        props.customToc.forEach((item) => {
            slides.push(item);
            if (item.sublist && item.sublist.length) {
                item.sublist.forEach((subItem) => {
                    slides.push(subItem);
                });
            }
        });
        return slides;
    }
});

watch(
    () => props.activeChapterIndex,
    () => {
        updateActiveIdx();
    }
);

onMounted(() => {
    const introSection = document.getElementById('intro');
    introExists.value = !!introSection;

    document.addEventListener('click', handleMouseClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleMouseClick);
});

const hideSublists = (): void => {
    sublistToggled.value = -1;
};

const handleMouseClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const tocItem = target.closest('.toc-item');
    const sublistItem = target.closest('.sublist-menu');

    // ignore if clicking on sublist toggle button, its svg icon or any sublist item in dropdown
    if ((tocItem && tocItem.querySelector('button')?.contains(target)) || sublistItem) {
        return;
    } else {
        hideSublists();
    }
};

const scrollToTarget = (index) => {
    console.log('CURRENT SLIDE INDEX');
    console.log(props.activeChapterIndex);
    console.log('DESTINATION SLIDE INDEX');
    console.log(index);
    emit('scroll-to-slide', index);
};

const scrollToChapter = (id: string): void => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
};

const toggleSublist = (index: number): void => {
    sublistToggled.value = sublistToggled.value !== index ? index : -1;
};

const isSublistActive = (sublist: MenuItem[] | undefined): boolean => {
    if (sublist) {
        return sublist.some((subItem) => lastActiveIdx.value === subItem.slideIndex);
    }
    return false;
};

const updateActiveIdx = () => {
    if (props.customToc) {
        const prevCustomSlides: MenuItem[] = customTocSlides.value!.filter(
            (slide) => slide.slideIndex <= props.activeChapterIndex
        );
        lastActiveIdx.value = prevCustomSlides.length ? prevCustomSlides[prevCustomSlides.length - 1].slideIndex : -1;
    } else {
        const prevSlides = tocSlides.value.filter((slide) => slide.index <= props.activeChapterIndex);
        lastActiveIdx.value = prevSlides.length ? prevSlides[prevSlides.length - 1].index : -1;
    }
};

const handleFocus = (idx: number) => {
    setTimeout(() => {
        const tocItems = itemContainer.value;
        if (tocItems && tocItems[idx] && !(tocItems[idx] as HTMLElement).contains(document.activeElement)) {
            sublistToggled.value = -1;
        }
    }, 0);
};
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

.navbar > ul {
    display: flex;
    list-style-type: none;
    text-align: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    padding: 5px;
    margin: auto;
}

.navbar > ul > li {
    float: left;
    width: 12%;
    border-radius: 8px;
    position: relative;
    a {
        text-overflow: ellipsis;
    }

    a:hover {
        text-decoration: none;
        color: inherit;
    }

    a:focus {
        text-decoration: none;
        color: inherit;
    }

    a:visited {
        color: inherit;
    }

    &.is-active {
        background-color: var(--sr-accent-colour);
        font-weight: bold;
    }
}

.separator {
    position: relative;
}

.separator::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 80%;
    width: 1px;
    background-color: #e0e0e0;
}

.sublist-menu {
    position: absolute;
    width: 100%;
    background-color: rgb(255, 255, 255);
    box-sizing: border-box;

    > li {
        background-color: rgb(255, 255, 255);
        font-weight: normal;

        &.is-active {
            background-color: var(--sr-accent-colour);
            font-weight: bold;
        }
    }
}

.rotate-180 {
    transform: rotate(-180deg);
}
</style>
