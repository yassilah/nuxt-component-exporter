import { type GlobalComponents, ref, type AllowedComponentProps, type VNodeProps } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import type { ExportFormat } from '../../types'

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
   * Exports the component as an image.
   */
  async function getComponentImageData<C extends string>(component: C, props: ComponentProps<C>, format: ExportFormat) {
    return $fetch(componentExporter.endpoint, {
      method: 'POST',
      body: {
        component,
        format,
        props,
      },
    }) as Promise<Blob>
  }

  /**
   * Click on a fake link.
   */
  function startDownload(href: string, filename: string) {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = href
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Download the component as an image.
   */
  async function download<C extends string>(component: C, props: ComponentProps<C>, filename = 'export', format: ExportFormat = 'png') {
    try {
      loading.value = true
      const data = await getComponentImageData(component, props, format)
      startDownload(URL.createObjectURL(data), `${filename}.${format}`)
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
