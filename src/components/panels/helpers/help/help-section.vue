<template>
    <div v-if="helpSection.drawn">
        <div>
            <div class="help-section-header flex items-center px-25 h-full w-full">
                <!-- name -->
                <span class="text-xl text-left flex-grow">{{ helpSection.header }}</span>
            </div>
            <transition name="help-item" mode="out-in">
                <div
                    v-show="helpSection.expanded"
                    v-html="helpSection.info"
                    class="ramp-markdown section-body px-10 overflow-hidden"
                ></div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { HelpSection } from '@storylines/definitions';

const props = defineProps({
    helpSection: {
        type: Object as PropType<HelpSection>,
        required: true
    }
});
</script>
<style lang="scss" scoped>
.ramp-markdown :not(table, td, img) {
    all: revert;
}

.help-section-header {
    padding: 10px 15px !important;
    margin: 0px !important;
}

.help-section-header .dropdown-icon {
    transition: transform 0.3s cubic-bezier(0.35, 0, 0.25, 1);
}

.help-item-leave-active,
.help-item-enter-active {
    transition: all 0.3s;
}

.help-item-enter-active {
    transition-delay: 0.1s;
}

.help-item-leave-to,
.help-item-enter {
    @apply max-h-0 opacity-0;
}
</style>
