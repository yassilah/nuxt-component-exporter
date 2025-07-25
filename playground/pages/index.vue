<script setup lang="ts">
const { download, loading: exporting } = useComponentExporter()
</script>

<template>
  <div>
    Nuxt module playground!

    <button
      :disabled="exporting"
      @click="download('Test', { cool: 'yes' })"
    >
      Download PNG
    </button>

    <NuxtLink to="/other">
      Go to other
    </NuxtLink>
  </div>
</template>
