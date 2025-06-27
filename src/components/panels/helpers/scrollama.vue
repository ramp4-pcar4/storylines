<template>
    <div class="scrollama__steps" ref="rootElement">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import scrollama from 'scrollama';
import { offset } from 'highcharts';

const emit = defineEmits(['step-progress', 'step-enter', 'step-exit']);

let rootElement = ref();
const _scroller = ref();
const attrs = new Proxy(
    {},
    {
        get: (_, prop) => rootElement.value.getAttribute(prop),
        has: (_, prop) => rootElement.value.hasAttribute(prop)
    }
);

onMounted(() => {
    _scroller.value = scrollama();
    setup();
});

onBeforeUnmount(() => {
    if (_scroller.value) {
        _scroller.value.destroy();
    }
    window.removeEventListener('resize', handleResize);
});

watchEffect(() => {
    setup();
});

function getDynamicOffset(): number {
    const navbar = document.getElementById('h-navbar');
    if (!navbar) return 0.2;
    const navbarHeight = navbar.offsetHeight;
    const offsetRatio = (navbarHeight + 64) / window.innerHeight;
    return offsetRatio;
}

function setup() {
    if (_scroller.value) {
        _scroller.value.destroy();
    }

    if (rootElement.value) {
        const opts: any = {
            step: Array.from(rootElement.value.children),
            progress: 'step-progress' in attrs,
            offset: getDynamicOffset(),
            ...attrs
        };

        _scroller.value = scrollama()
            .setup(opts)
            .onStepProgress((resp) => {
                emit('step-progress', resp);
            })
            .onStepEnter((resp) => {
                emit('step-enter', resp);
            })
            .onStepExit((resp) => {
                emit('step-exit', resp);
            });

        window.addEventListener('resize', handleResize);
    }
}

function handleResize() {
    if (_scroller.value) {
        _scroller.value.resize();
    }
}
</script>
