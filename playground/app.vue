<script setup lang="ts">
const { download, loading: exporting } = useComponentExporter()
</script>

<template>
  <button
    :disabled="exporting"
    @click="download('Test')"
  >
    Download Test Component
  </button>
</template>
