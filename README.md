<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nuxt Component Exporter
- Package name: @yassidev/nuxt-component-exporter
- Description: A simple Nuxt module to export components as images.
-->

# Nuxt Component Exporter

[npm version][npm-version-href]
[npm downloads][npm-downloads-href]
[License][license-href]
[Nuxt][nuxt-href]

A simple Nuxt module to export components as images.

⚠️ This is an experimental module.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@yassidev/nuxt-component-exporter?file=playground%2Fapp.vue) -->

<!-- - [📖  Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->

- 🌇 Export any Vue component as PNG, JPEG, Webp or PDF
- 🌎 Works in serverless functions
- ⚙️ `useComponentExporter` composable
- 🚀 No configuration needed

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add @yassidev/nuxt-component-exporter
```

That's it! You can now use Nuxt Component Exporter in your Nuxt app ✨

## Example
You first need to make sure that your component is globally registered.


```vue
// @/components/foo.global.vue
<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="text-3xl">{{ message }}</div>
</template>
```

And that's it, you should be able to export your component as desiered (with auto-completion!)
```vue
<script setup lang="ts">
const { download, loading } = useComponentExporter()
</script>

<template>
  <button
    :disabled="loading"
    @click="download('Foo', { message: 'bar' })"
  >
    Download PNG
  </button>
</template>

```

## Contribution

<details>
  <summary>Local development</summary>

```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
```

</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@yassidev/nuxt-component-exporter/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@yassidev/nuxt-component-exporter
[npm-downloads-src]: https://img.shields.io/npm/dm/@yassidev/nuxt-component-exporter.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@yassidev/nuxt-component-exporter
[license-src]: https://img.shields.io/npm/l/@yassidev/nuxt-component-exporter.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@yassidev/nuxt-component-exporter
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
