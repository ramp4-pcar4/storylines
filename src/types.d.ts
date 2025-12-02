import { VuePapaParse } from 'vue-papa-parse';
import { RouteLocationNormalized } from 'vue-router';
import type { Vfm } from 'vue-final-modal';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $papa: VuePapaParse;
        $route: RouteLocationNormalized;
        $t: (key: string, ...args: any[]) => string;
        $vfm: Vfm;
    }
}
