import { defineConfig } from 'vite';
import type { UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import dsv from '@rollup/plugin-dsv';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
//@ts-ignore
import replaceTokensPlugin from './vite-plugins/replace-tokens.js';

const baseConfig: UserConfigExport = {
    plugins: [
        vue(),
        dsv(),
        viteStaticCopy({
            targets: [
                { src: 'scripts/*', dest: './scripts' },
                { src: 'help', dest: './' },
                { src: 'StorylinesSchema.json', dest: './' }
            ]
        }),
        replaceTokensPlugin({
            tokens: {
                'BASE_URL': process.env.BASE_URL || '/'
            }
        })
    ],
    define: {
        'process.env': process.env
    },
    base: process.env.BASE_URL || '/',
    resolve: {
        alias: {
            '@storylines': path.resolve(__dirname, 'src'),
            vue: 'vue/dist/vue.esm-bundler.js'
        }
    },
    build: {
        target: 'esnext'
    },
    server: {
        open: '/en/00000000-0000-0000-0000-000000000000'
    }
};

export default defineConfig(() => {
    if (process.argv.includes('plugin')) {
        Object.assign(baseConfig.build!, {
            lib: {
                entry: path.resolve(__dirname, 'src/storylines-plugin.ts'),
                name: 'StorylinesViewer',
                fileName: 'storylines-viewer'
            },
            rollupOptions: {
                external: ['vue', 'ramp-pcar'],
                output: {
                    globals: {
                        vue: 'Vue',
                        'vue-papa-parse': 'VuePapaParse'
                    },
                    inlineDynamicImports: true,
                    dir: 'dist'
                }
            },
            copyPublicDir: false
        });
    } else {
        Object.assign(baseConfig.build!, {
            rollupOptions: {
                input: {
                    main: '/index.html',
                    en: '/index-ca-en.html',
                    fr: '/index-ca-fr.html',
                    lpen: '/index-lp-ca-en.html',
                    lpfr: '/index-lp-ca-fr.html',
                }
            }
        });
    }
    return baseConfig;
});
