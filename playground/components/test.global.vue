<script setup lang="ts">
export type Props = {
  cool: string
}

defineProps<Props>()
</script>

<template>
  <div>cooool</div>
  <p>{{ cool }}</p>
</template>
