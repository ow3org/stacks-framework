// import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import dts from 'vite-plugin-dts'
import { resolve } from 'pathe'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Unocss from 'unocss/vite'
import { alias } from '../../../alias'
import { VITE_PLUGIN_NAME, VUE_PACKAGE_NAME } from '../../shared/constants'
import { UserOptions } from './options'

export default function Stacks(userOptions: UserOptions = {}) {
    // eslint-disable-next-line no-console
    console.log('Stacks userOptions', userOptions);

    // let server: ViteDevServer | undefined
    // let viteConfig: ResolvedConfig

    // const plugins: Plugin[] = []

    let lib = {
        entry: resolve(__dirname, 'src/index.ts'),
        name: VUE_PACKAGE_NAME,
        formats: ['cjs', 'es'],
        fileName: (format: string) => {
            if (format === 'es')
                return `${VUE_PACKAGE_NAME}.mjs`

            if (format === 'cjs')
                return `${VUE_PACKAGE_NAME}.cjs`

            // if (format === 'iife')
            //     return `${VUE_PACKAGE_NAME}.global.js`

            return `${VUE_PACKAGE_NAME}.?.js`
        },
    }

    return {
        name: VITE_PLUGIN_NAME,

        resolve: {
            dedupe: ['vue'],
            alias,
        },

        plugins: [
            Vue(),

            Inspect(), // only applies in dev mode & visit localhost:3000/__inspect/ to inspect the modules

            dts({
                tsConfigFilePath: '../../tsconfig.json',
                insertTypesEntry: true,
                outputDir: './types',
                cleanVueFileName: true,
            }),

            Unocss({
                mode: 'vue-scoped', // or 'shadow-dom'
                configFile: './unocss.config.ts',
            }),

            // https://github.com/antfu/unplugin-auto-import
            AutoImport({
                imports: ['vue', '@vueuse/core', {
                    '@ow3/hello-world-composable': ['count', 'increment', 'isDark', 'toggleDark'],
                }],
                dts: '../types/auto-imports.d.ts',
                eslintrc: {
                    enabled: true,
                    filepath: '../.eslintrc-auto-import.json',
                },
            }),

            // https://github.com/antfu/unplugin-vue-components
            Components({
                dirs: ['../../vue/src/components'],
                extensions: ['vue'],
                dts: '../types/components.d.ts',
            }),
        ],

        // vue components build
        build: {
            lib
        },

        rollupOptions: {
            external: ['vue'],
            output: {
                // exports: 'named',
                globals: {
                    vue: 'Vue',
                },
            },
        },

        //     // sourcemap: true,
        //     // minify: false,
        // },

        // for web components build
        // build: {
        //     lib: {
        //         entry: resolve(__dirname, 'src/index.ts'),
        //         name: 'hello-world-elements',
        //         formats: ['cjs', 'es'],
        //         fileName: (format: string) => {
        //             if (format === 'es')
        //                 return 'hello-world-elements.mjs'

        //             if (format === 'cjs')
        //                 return 'hello-world-elements.cjs'

        //             // if (format === 'iife')
        //             //   return 'hello-world-elements.global.js'

        //             return 'hello-world-elements.?.js'
        //         },
        //     },

        //     // sourcemap: true,
        //     // minify: false,
        // },
    }
}