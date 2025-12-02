import { createApp } from 'vue';
import App from './app.vue';

import './router/componentHooks';
import router from './router';
import './style.css';
import { i18n } from './lang';

import 'ramp-pcar/dist/ramp.css';
import VueTippy from 'vue-tippy';
import HighchartsVue from 'highcharts-vue';
import VuePapaParse from 'vue-papa-parse';
import VueFullscreen from 'vue-fullscreen';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
import 'vue-final-modal/style.css';
import { vfm } from './plugins/vfm/index';

const app = createApp(App);

app.use(router)
    .use(i18n)
    .use(HighchartsVue, { tagName: 'highchart' })
    .use(VueTippy, {
        directive: 'tippy',
        component: 'tippy'
    })
    .use(VuePapaParse)
    .use(VueFullscreen)
    .use(vfm);

app.provide('$papa', app.config.globalProperties.$papa);

app.mount('#app');
