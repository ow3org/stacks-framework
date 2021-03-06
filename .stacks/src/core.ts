import { resolve } from 'path'
import type { PluginOption, UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Comps from 'unplugin-vue-components/vite'
import Inspect from 'vite-plugin-inspect'

export { createApp } from 'vue'
export { defineConfig } from 'vite'

export type ViteConfig = UserConfig

export function UiEngine(isCustomElement = false) {
  if (isCustomElement) {
    return Vue({
      template: {
        compilerOptions: {
          // todo: automatically generate this
          isCustomElement: () => true,
        },
      },
    })
  }

  return Vue()
}

export function StyleEngine() {
  return Unocss({
    configFile: resolve(__dirname, './unocss.ts'),
    mode: 'vue-scoped', // or 'shadow-dom'
  })
}

// https://github.com/antfu/unplugin-auto-import
export function AutoImports() {
  return AutoImport({
    imports: ['vue', '@vueuse/core',
      // {
      // TODO: this needs to be dynamically generated
      // '@ow3/hello-world-functions': ['count', 'increment', 'isDark', 'toggleDark'],
      // }
    ],
    dts: resolve(__dirname, '../types/auto-imports.d.ts'),
    eslintrc: {
      enabled: true,
      filepath: resolve(__dirname, '../.eslintrc-auto-import.json'),
    },
  })
}

export function Components() {
  return Comps({
    dirs: ['../../components'],
    extensions: ['vue'],
    dts: '../types/components.d.ts',
  })
}

export const Stacks = () => <PluginOption>[
  Inspect(),

  UiEngine,

  StyleEngine,

  AutoImports,

  Components,
]

export default { resolve, Stacks, UiEngine, AutoImports, StyleEngine, Components }
