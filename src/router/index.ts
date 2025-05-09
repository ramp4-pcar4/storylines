//import StoryV from '@storylines/components/story/story.vue';
import { createRouter, createWebHashHistory, type RouteLocationNormalized } from 'vue-router';
import { EventBus } from '../event-bus';
const routes = [
    {
        path: '/',
        component: () => import('@storylines/components/story/story.vue')
    },
    {
        path: '/:uid',
        component: () => import('@storylines/components/story/story.vue')
    },
    {
        path: '/:lang/:uid',
        component: () => import('@storylines/components/story/story.vue')
    }
];

const router = createRouter({
    routes: routes,
    // mode: 'history', // TODO: uncomment to change to history mode for nicer URLs (eliminating middle hash) see #100
    history: createWebHashHistory(),
    scrollBehavior: function (to: RouteLocationNormalized, from) {
        if (to.hash) {
            console.log('to');
            console.log(to);
            console.log('from');
            console.log(from);
            console.log('slide index:');
            console.log(to.hash.split('-')[0].split('#').at(-1));
            EventBus.emit('scroll-to-slide', { slideIndex: to.hash.split('-')[0].split('#').at(-1) });

            // Delay is needed to allow slides to force load when lazy loading is enabled
            const delay = from.href ? 100 : 1000; // routing upon a page reload needs more time
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        el: decodeURIComponent(to.hash),
                        behavior: 'smooth',
                        top:
                            (document.getElementById('h-navbar')?.clientHeight || 0) +
                            (document.getElementById('story-header')?.clientHeight || 0)
                    });
                }, delay);
            });
        }
    }
});

export default router;
