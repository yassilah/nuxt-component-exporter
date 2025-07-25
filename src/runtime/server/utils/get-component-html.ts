import type { H3Event } from 'h3'
import { hash } from 'ohash'
import { getRequestURL } from 'h3'
import { renderSSRHead } from '@unhead/vue/server'
import { createUnhead } from '@unhead/vue'
import { getRequestDependencies } from 'vue-bundle-renderer/runtime'
import type { NuxtIslandResponse } from 'nuxt/app'
import { createSSRContext } from '#nitro-renderer/app'
import { getRenderer } from '#nitro-renderer/build-files'

/**
 * Container ID.
 */
export const CONTAINER_ID = 'export-container'

/**
 * Get full html response for the Nuxt island component.
 */
export async function getComponentHtml(event: H3Event, component: string, props: Record<string, unknown>) {
  const response = await fetchIsland(event, {
    component,
    props,
  })

  const { host, protocol } = getRequestURL(event)

  const baseUrl = `${protocol}//${host}`

  const head = await getSSRHead(event, response)

  return [
    '<!DOCTYPE html>',
    `<html ${head.htmlAttrs}>`,
    `<base href="${baseUrl}" />`,
    `<head>${head.headTags}</head>`,
    `<body ${head.bodyAttrs}>`,
    head.bodyTagsOpen,
    `<div id="${CONTAINER_ID}">`,
    response.html,
    '</div>',
    head.bodyTags,
    `</body>`,
    `</html>`,
  ].join('')
}

/**
 * Fetches the Nuxt island component with the given name and props.
 */
function fetchIsland(event: H3Event, props: Record<string, unknown>): Promise<NuxtIslandResponse> {
  const hashId = hash(['ComponentExporter', props]).replaceAll('_', '-')
  return event.$fetch<NuxtIslandResponse>(`/__nuxt_island/ComponentExporter_${hashId}.json`, {
    params: {
      props: JSON.stringify(props),
    },
  })
}

/**
 * Get SSR head for the current event.
 */
async function getSSRHead(event: H3Event, response: NuxtIslandResponse) {
  const unhead = createUnhead()
  unhead.push(response.head)
  unhead.push({ link: await getStyleLinks(event) })
  return await renderSSRHead(unhead)
}

/**
 * Get the style link tags.
 */
async function getStyleLinks(event: H3Event) {
  const links = await getStyles(event)
  return links.map(link => ({
    rel: 'stylesheet',
    href: link,
  }))
}

/**
 * Fetches the styles for the current SSR context.
 */
async function getStyles(event: H3Event) {
  const ssrContext = createSSRContext(event)
  const renderer = await getRenderer(ssrContext)
  const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext) as { styles: Record<string, { file: string }> }
  return Object.values(styles).map(style => renderer.rendererContext.buildAssetsURL(style.file))
}
