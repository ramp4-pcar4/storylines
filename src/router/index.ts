import { createRouter, createWebHistory, type RouteLocation, type RouteLocationNormalized } from 'vue-router';
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
    history: createWebHistory('' + import.meta.env.BASE_URL),
    scrollBehavior: function (to: RouteLocationNormalized, from) {
        if (to.hash) {
            EventBus.emit('scroll-to-slide', { slideIndex: to.hash.split('-')[0].split('#').at(-1) });

            // Delay is needed to allow slides to force load when lazy loading is enabled
            const delay = from.fullPath ? 100 : 1000; // routing upon a page reload needs more time
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

// redirects old hash URLs to the new URLs
router.beforeEach((to, from, next) => {
    if (to.fullPath.startsWith('/#/')) {
        next({ path: to.fullPath.substring(2), replace: true});
    } else {
        next();
    }
})

export default router;
