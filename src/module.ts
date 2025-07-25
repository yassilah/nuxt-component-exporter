import { defineNuxtModule, createResolver, addServerHandler, addComponent, resolveModule, addImports } from '@nuxt/kit'
import { join } from 'node:path'

export interface ModuleOptions {
  endpoint?: string
  enabled?: boolean
  useExternalChromium?: boolean
  islandComponent?: string
}

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'component-exporter',
    configKey: 'exporter',
  },
  defaults: () => ({
    endpoint: '/api/export',
    enabled: true,
    useExternalChromium: false,
  }),
  async setup(options, nuxt) {
    addServerHandler({
      handler: resolve('./runtime/server/handler'),
      route: options.endpoint,
      method: 'post',
    })

    addImports({
      name: 'useComponentExporter',
      from: resolve('./runtime/composables/useComponentExporter'),
    })

    addComponent({
      island: true,
      name: 'ComponentExporter',
      filePath: options.islandComponent || resolve('./runtime/components/component-exporter.vue'),
    })

    // Temporary workaround
    const basePath = resolveModule('nuxt')
    const path = resolve(join(basePath, '../core/runtime/nitro/utils/renderer'))
    nuxt.options.nitro.alias ??= {}
    nuxt.options.alias['#nitro-renderer'] = path
    nuxt.options.nitro.alias['#nitro-renderer'] = path

    if (nuxt.options.experimental.componentIslands === 'auto') {
      nuxt.options.experimental.componentIslands = true
    }

    if (options.useExternalChromium) {
      const { addDependency } = await import('nypm')
      await addDependency('@sparticuz/chromium')
    }

    nuxt.options.runtimeConfig.componentExporter = {
      useExternalChromium: options.useExternalChromium || false,
    }

    nuxt.options.runtimeConfig.public.componentExporter = {
      endpoint: options.endpoint || '',
    }
  },
})
