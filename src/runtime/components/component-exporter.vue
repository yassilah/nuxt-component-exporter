<script setup lang="ts">
export type Props = {
  component: string
  props?: Record<string, unknown>
}

const { component, props } = defineProps<Props>()
</script>

<template>
  <component
    :is="component"
    v-bind="props"
  />
</template>
