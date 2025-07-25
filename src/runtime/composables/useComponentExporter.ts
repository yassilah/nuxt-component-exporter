import { type GlobalComponents, ref, type AllowedComponentProps, type VNodeProps } from 'vue'
import { useNuxtApp, useRuntimeConfig } from 'nuxt/app'
import type { ExportFormat } from '../../types'
import { defu } from 'defu'

type ComponentProps<C extends string> = C extends keyof GlobalComponents
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? GlobalComponents[C] extends infer U extends new(...args: any) => any
    ? Omit<InstanceType<U>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
    : Record<string, unknown>
  : Record<string, unknown>

/**
 * Composables for exporting components as images.
 */
export function useComponentExporter() {
  /**
   * Loading state.
   */
  const loading = ref(false)

  /**
   * Component exporter options.
   */
  const { componentExporter } = useRuntimeConfig().public

  /**
   * Checks if a component is registered globally.
   */
  function isRegisteredGlobally<C extends keyof GlobalComponents>(component: C): component is C {
    return Object.keys(useNuxtApp().vueApp._context.components).includes(component)
  }

  /**
   * Exports the component as an image.
   */
  async function getComponentImageData<C extends keyof GlobalComponents>(component: C, options: DownloadOptions<C>) {
    if (!isRegisteredGlobally(component)) throw new Error(`Component "${component}" is not registered globally.`)
    return $fetch(componentExporter.endpoint, {
      method: 'POST',
      body: {
        component,
        format: options.format,
        props: options.props,
      },
    }) as Promise<Blob>
  }

  /**
   * Click on a fake link.
   */
  function startDownload<C extends keyof GlobalComponents>(data: Blob, options: DownloadOptions<C>) {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = URL.createObjectURL(data)
    link.download = options.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Download the component as an image.
   */
  async function download<C extends keyof GlobalComponents>(component: C, _options: Partial<DownloadOptions<C>> = {}) {
    try {
      loading.value = true

      const options = defu(_options, {
        props: {},
        filename: `${component}.${_options.format || 'png'}`,
        format: 'png',
      } satisfies DownloadOptions<C>)

      const data = await getComponentImageData(component, options)

      startDownload(data, options)
    }
    catch (error) {
      console.error('Download failed:', error)
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    getComponentImageData,
    download,
  }
}

export type DownloadOptions<C extends keyof GlobalComponents> = {
  props: ComponentProps<C> | Record<string, unknown>
  filename: string
  format: ExportFormat
}
