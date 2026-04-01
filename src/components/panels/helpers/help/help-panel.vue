<template>
    <VueFinalModal
        modalId="help-panel"
        content-class="flex flex-col overflow-y-auto bg-white  w-3/4 p-5 rounded-lg space-y-2"
        class="help-panel flex justify-center items-center w-full"
        @closed="emit('close')"
    >
        <button
            class="self-end p-2 w-10 h-10 cursor-pointer hover:bg-gray-200 font-bold z-10"
            @click="$vfm.close('help-panel')"
            @keypress.enter="$vfm.close('help-panel')"
            tabindex="0"
            ref="helpModalCloseButton"
            v-tippy="{
                content: $t('gallery.close'),
                placement: 'left',
                toggle: 'mouseenter focus click'
            }"
        >
            X
        </button>
        <div class="help-panel-content">
            <HelpSectionV v-for="(section, idx) in helpSections" :helpSection="section" :key="idx"></HelpSectionV>
        </div>
    </VueFinalModal>
</template>

<script setup lang="ts">
import type { HelpSection } from '@storylines/definitions';
import HelpSectionV from './help-section.vue';
import { VueFinalModal } from 'vue-final-modal';

const props = defineProps({
    helpSections: {
        type: Array as () => HelpSection[],
        required: true
    }
});

const emit = defineEmits(['close']);
</script>
<style lang="scss" scoped>
.help-panel-content {
    max-height: 80vh;
    overflow-y: auto;
}
.storyramp-app .help-panel :not(table, td, img) {
    all: revert;
}

.vfm__content,
.vfm .vfm__content {
    max-width: 80%;
    min-width: 70%;
    max-height: 80%;
    margin: 16px;
    padding: 4px;
}
</style>
