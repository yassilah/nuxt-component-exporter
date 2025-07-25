import { defineNuxtModule, createResolver, addServerHandler, addComponent, resolveModule, addImports, installModule } from '@nuxt/kit'
import { join } from 'node:path'

export interface ModuleOptions {
  endpoint?: string
  enabled?: boolean
  useExternalChromium?: boolean
}

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
    const { resolve } = createResolver(import.meta.url)

    addServerHandler({
      handler: resolve('./runtime/server/handler'),
      route: options.endpoint,
      method: 'post',
    })

    addImports({
      name: 'useComponentExporter',
      from: resolve('./runtime/composables/useComponentExporter'),
    })

    nuxt.options.experimental.componentIslands ??= true

    addComponent({
      island: true,
      name: 'ComponentExporter',
      filePath: resolve('./runtime/components/component-exporter.vue'),
    })

    // Temporary workaround
    const basePath = resolveModule('nuxt')
    const path = resolve(join(basePath, '../core/runtime/nitro/utils/renderer'))
    nuxt.options.nitro.alias ??= {}
    nuxt.options.alias['#nitro-renderer'] = path
    nuxt.options.nitro.alias['#nitro-renderer'] = path

    if (options.useExternalChromium) {
      await installModule('@sparticuz/chromium')
    }

    nuxt.options.runtimeConfig.componentExporter = {
      useExternalChromium: options.useExternalChromium || false,
    }

    nuxt.options.runtimeConfig.public.componentExporter = {
      endpoint: options.endpoint || '',
    }
  },
})
