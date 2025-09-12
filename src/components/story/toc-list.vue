<template>
    <ul
        v-show="isMenuOpen || tocType !== 'mobile'"
        :class="{
            'nav-content-mobile bg-white pb-10 w-72 z-10 border-r border-gray-200': tocType === 'mobile',
            'nav-content-horizontal': tocType === 'horizontal',
            'nav-content': tocType !== 'horizontal'
        }"
    >
        <li v-if="introExists && returnToTop">
            <a
                class="flex py-1"
                :class="{
                    'items-center mx-1 cursor-pointer px-2 ': tocType !== 'mobile',
                    'px-3': tocType === 'mobile'
                }"
                style="margin-inline: 4px !important"
                @click="scrollToChapter('intro')"
                @keydown.enter="scrollToChapter('intro')"
                v-tippy="{
                    delay: '200',
                    placement: tocType === 'horizontal' ? 'top' : 'right',
                    content: $t('chapters.return'),
                    animateFill: true,
                    animation: 'chapter-menu'
                }"
                tabindex="0"
                v-if="plugin"
                role="button"
            >
                <svg
                    class="flex-shrink-0"
                    viewBox="0 0 24 24"
                    width="24px"
                    height="24px"
                    fill="#fff"
                    stroke="#878787"
                    xmlns="http://www.w3.org/2000/svg"
                    v-if="tocType !== 'horizontal'"
                >
                    <path
                        data-v-689fab2c=""
                        d="m19.325 16.229c-2.4415 1.4096-4.8829 2.8191-7.3244 4.2286-2.4415-1.4096-4.883-2.8192-7.3245-4.2288-3.55e-5 -2.8191-7.1e-5 -5.6383-1.066e-4 -8.4574 2.4415-1.4096 4.8829-2.8191 7.3244-4.2286 2.4415 1.4096 4.883 2.8192 7.3245 4.2288 3.7e-5 2.8191 7.4e-5 5.6383 1.1e-4 8.4574z"
                        stroke-width=".93974"
                        style="fill: rgba(255, 255, 255, 0); fill-opacity: 0"
                        transform="matrix(1, 0, 0, 1, 8.881784197001252e-16, 0)"
                    />
                    <g transform="matrix(1, 0, 0, 1, 0.07912001013755887, 1.1142139434814453)">
                        <polygon
                            points="11.956 9.662 9.522 12.097 9.862 12.437 11.956 10.344 14.049 12.437 14.39 12.097"
                            style=""
                        />
                        <path
                            style="fill: rgb(135, 135, 135); stroke-width: 1.5px"
                            d="M 11.917 10.545 L 11.917 15.649"
                        />
                    </g>
                    <rect
                        x="9.114"
                        y="8.74"
                        width="5.842"
                        height="0.487"
                        style=""
                        transform="matrix(1, 0, 0, 1, 8.881784197001252e-16, 0)"
                    />
                </svg>
                <span class="flex-1 ml-4 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap">{{
                    $t('chapters.return')
                }}</span>
            </a>

            <router-link
                :to="{ hash: '#intro', query: route.query }"
                class="flex py-1"
                :class="{ 'items-center mx-1 px-2': tocType !== 'mobile', 'px-3': tocType === 'mobile' }"
                target
                v-tippy="{
                    delay: '200',
                    placement: tocType === 'horizontal' ? 'top' : 'right',
                    content: $t('chapters.return'),
                    animateFill: true,
                    animation: 'chapter-menu'
                }"
                v-else
            >
                <svg
                    class="flex-shrink-0"
                    viewBox="0 0 24 24"
                    width="24px"
                    height="24px"
                    fill="#fff"
                    stroke="#878787"
                    xmlns="http://www.w3.org/2000/svg"
                    v-if="tocType !== 'horizontal'"
                >
                    <path
                        data-v-689fab2c=""
                        d="m19.325 16.229c-2.4415 1.4096-4.8829 2.8191-7.3244 4.2286-2.4415-1.4096-4.883-2.8192-7.3245-4.2288-3.55e-5 -2.8191-7.1e-5 -5.6383-1.066e-4 -8.4574 2.4415-1.4096 4.8829-2.8191 7.3244-4.2286 2.4415 1.4096 4.883 2.8192 7.3245 4.2288 3.7e-5 2.8191 7.4e-5 5.6383 1.1e-4 8.4574z"
                        stroke-width=".93974"
                        style="fill: rgba(255, 255, 255, 0); fill-opacity: 0"
                        transform="matrix(1, 0, 0, 1, 8.881784197001252e-16, 0)"
                    />
                    <g transform="matrix(1, 0, 0, 1, 0.07912001013755887, 1.1142139434814453)">
                        <polygon
                            points="11.956 9.662 9.522 12.097 9.862 12.437 11.956 10.344 14.049 12.437 14.39 12.097"
                            style=""
                        />
                        <path
                            style="fill: rgb(135, 135, 135); stroke-width: 1.5px"
                            d="M 11.917 10.545 L 11.917 15.649"
                        />
                    </g>
                    <rect
                        x="9.114"
                        y="8.74"
                        width="5.842"
                        height="0.487"
                        style=""
                        transform="matrix(1, 0, 0, 1, 8.881784197001252e-16, 0)"
                    />
                </svg>
                <span class="flex-1 ml-4 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap">{{
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
                    separator:
                        tocType === 'horizontal' &&
                        ((!returnToTop && idx % 8 !== 0) || (returnToTop && (idx + 1) % 8 !== 0))
                }"
                ref="itemContainer"
                @focusout="handleFocus(idx)"
            >
                <toc-item
                    :tocItem="item"
                    :slides="slides"
                    :plugin="plugin"
                    @scroll-to-slide="scrollToTarget"
                    :verticalToc="tocType !== 'horizontal'"
                >
                    <button
                        class="mr-1"
                        :aria-label="$t('chapters.menu.dropdown')"
                        v-if="item.sublist && item.sublist.length && (tocType === 'horizontal' || isMenuOpen)"
                        @click="toggleSublist(idx)"
                    >
                        <svg
                            data-v-b1261e08=""
                            xmlns="http://www.w3.org/2000/svg"
                            height="18"
                            viewBox="0 0 24 24"
                            width="18"
                            :class="{ 'rotate-180': isSublistToggled(idx) }"
                        >
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                        </svg>
                    </button>
                </toc-item>

                <!-- Dropdown for sublists -->
                <ul
                    v-show="isSublistToggled(idx)"
                    :class="{
                        'sublist-menu-horizontal mt-1': tocType === 'horizontal',
                        'sublist-menu': tocType !== 'horizontal'
                    }"
                >
                    <li
                        v-for="(subItem, subIdx) in item.sublist"
                        :key="subIdx"
                        :class="{
                            'border-t-2': tocType === 'horizontal' && subIdx !== 0,
                            'border-gray-300': tocType === 'horizontal',
                            'is-active': lastActiveIdx === subItem.slideIndex
                        }"
                    >
                        <toc-item
                            :tocItem="subItem"
                            :slides="slides"
                            :parentItem="false"
                            :plugin="plugin"
                            :verticalToc="tocType !== 'horizontal'"
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
                    separator:
                        tocType === 'horizontal' &&
                        ((!returnToTop && idx % 8 !== 0) || (returnToTop && (idx + 1) % 8 !== 0))
                }"
            >
                <toc-item
                    :tocItem="{ ...slide, slideIndex: slide.index }"
                    :slides="slides"
                    :plugin="plugin"
                    @scroll-to-slide="scrollToTarget"
                    :verticalToc="tocType !== 'horizontal'"
                ></toc-item>
            </li>
        </template>
    </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref, watch, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuItem, Slide } from '@storylines/definitions';
import TocItem from '@storylines/components/panels/helpers/toc-item.vue';

const route = useRoute();

const props = defineProps({
    activeChapterIndex: {
        type: Number,
        required: true
    },
    returnToTop: {
        type: Boolean,
        default: true
    },
    tocType: {
        type: String,
        required: true
    },
    slides: {
        type: Array as PropType<Array<Slide>>,
        required: true
    },
    isMenuOpen: {
        type: Boolean,
        required: false,
        default: true
    },
    customToc: {
        type: Array as PropType<Array<MenuItem>>,
        required: false
    },
    plugin: {
        type: Boolean,
        required: false,
        default: false
    }
});

const sublistToggled = ref({} as Record<number, boolean>);
const sublistToggledHorizontal = ref<number>(-1);
const introExists = ref(false);
const itemContainer = ref(null);
const lastActiveIdx = ref(-1);

const emit = defineEmits(['scroll-to-slide']);

watch(
    () => props.activeChapterIndex,
    () => {
        updateActiveIdx();
    }
);

onMounted(() => {
    const introSection = document.getElementById('intro');
    introExists.value = !!introSection;

    if (props.tocType !== 'horizontal' && props.customToc) {
        props.customToc.forEach((item, idx) => {
            sublistToggled.value[idx] = false;
        });
    }

    if (props.tocType === 'horizontal') {
        document.addEventListener('click', handleMouseClick);
    }
});

onBeforeUnmount(() => {
    if (props.tocType === 'horizontal') {
        document.removeEventListener('click', handleMouseClick);
    }
});

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

const scrollToTarget = (index) => {
    emit('scroll-to-slide', index);
};

const scrollToChapter = (id: string): void => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
};

// filter out which slides are visible in the table of contents while preserving original slide index
const tocSlides = computed(() => {
    let slides = props.slides.map((slide, idx) => ({ ...slide, index: idx }));
    if (props.tocType === 'horizontal' || !props.customToc) {
        slides = slides.filter((slide) => slide.includeInToc !== false);
    }
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

const toggleSublist = (index: number): void => {
    if (props.tocType === 'horizontal') {
        sublistToggledHorizontal.value = sublistToggledHorizontal.value !== index ? index : -1;
    } else {
        sublistToggled.value[index] = !sublistToggled.value[index];
    }
};

const isSublistToggled = (index: number): boolean => {
    if (props.tocType === 'horizontal') {
        return sublistToggledHorizontal.value === index;
    }
    return sublistToggled.value[index];
};

const isSublistActive = (sublist: MenuItem[] | undefined): boolean => {
    if (sublist) {
        return sublist.some((subItem) => lastActiveIdx.value === subItem.slideIndex);
    }
    return false;
};

const hideSublists = (): void => {
    sublistToggledHorizontal.value = -1;
};

const handleMouseClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const tocItem = target.closest('.toc-item');
    const sublistItem = target.closest('.sublist-menu-horizontal');

    // ignore if clicking on sublist toggle button, its svg icon or any sublist item in dropdown
    if ((tocItem && tocItem.querySelector('button')?.contains(target)) || sublistItem) {
        return;
    } else {
        hideSublists();
    }
};

const handleFocus = (idx: number) => {
    if (props.tocType === 'horizontal') {
        setTimeout(() => {
            const tocItems = itemContainer.value;
            if (tocItems && tocItems[idx] && !(tocItems[idx] as HTMLElement).contains(document.activeElement)) {
                sublistToggled.value = -1;
            }
        }, 0);
    }
};
</script>

<style lang="scss" scoped>
.nav-content {
    overflow-y: auto;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
}

.nav-content::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
}

.nav-content-mobile {
    height: calc(100vh - 4rem);
}

li {
    a:hover {
        text-decoration: none;
        color: inherit;
    }

    a:focus {
        text-decoration: none;
        color: inherit;
    }

    a:hover svg {
        stroke: var(--sr-accent-colour);
    }

    a:visited {
        color: inherit;
    }

    &.is-active {
        :deep(svg) {
            fill: var(--sr-accent-colour);
            stroke: var(--sr-accent-colour);
        }

        :deep(span) {
            font-weight: bold;
        }
    }
}

.sublist-menu {
    > li {
        font-weight: normal;
        :deep(svg) {
            fill: #fff !important;
            stroke: #878787 !important;
        }

        :deep(span) {
            font-weight: normal !important;
        }

        &.is-active {
            :deep(span) {
                font-weight: bold !important;
            }

            :deep(svg) {
                fill: var(--sr-accent-colour) !important;
                stroke: var(--sr-accent-colour) !important;
            }
        }
    }
}

.rotate-180 {
    transform: rotate(-180deg);
}

// Styling for horizontal Toc
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

.sublist-menu-horizontal {
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

.nav-content-horizontal {
    display: flex;
    row-gap: 5px;
    list-style-type: none;
    text-align: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    padding: 5px;
    margin: auto;
}

.nav-content-horizontal > li {
    float: left;
    width: 12%;
    border-radius: 8px;
    position: relative;
    a {
        text-overflow: ellipsis;
    }

    &.is-active {
        background-color: var(--sr-accent-colour);
        font-weight: bold;
    }
}
</style>
