import type { Page } from 'puppeteer'
import { CONTAINER_ID, getComponentHtml } from './get-component-html'
import type { H3Event } from 'h3'
import { createError } from 'h3'
import puppeteer from 'puppeteer'
import { useRuntimeConfig } from 'nitropack/runtime'
import type { ExportFormat } from '../../../types'

/**
 * Get page image.
 */
export async function getPageImage(event: H3Event, component: string, props: Record<string, unknown>, format: ExportFormat = 'png') {
  const page = await createNewPage()
  const html = await getComponentHtml(event, component, props)
  await page.setContent(html, { waitUntil: 'networkidle2' })
  const image = await getComponentImage(page, format)
  await page.browser().close()
  return image
}

/**
 * Get component image.
 */
async function getComponentImage(page: Page, type: ExportFormat) {
  if (type === 'pdf') {
    return page.pdf({
      printBackground: true,
    })
  }

  const el = await page.waitForSelector('#' + CONTAINER_ID)

  if (!el) throw createError({ statusCode: 404, statusMessage: 'Element not found' })

  return el.screenshot({
    type,
    optimizeForSpeed: true,
  })
}

/**
 * Creates a new Puppeteer page with the specified viewport and device scale factor.
 */
async function createNewPage() {
  const { componentExporter } = useRuntimeConfig()
  const chromium = componentExporter.useExternalChromium ? await import(/* @vite-ignore */ '@sparticuz/chromium').then(m => m.default) : undefined

  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 680,
      height: 1,
      deviceScaleFactor: 2,
    },
    args: chromium?.args,
    executablePath: await chromium?.executablePath(),
  })

  return browser.newPage() as Promise<Page>
}
