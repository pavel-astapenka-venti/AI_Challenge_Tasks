<template>
  <svg :width="size" :height="size" viewBox="0 0 2048 2048" fill="currentColor">
    <path d="M1024 0l316 684 736 84-552 492 156 728-656-372-656 372 156-728L-28 768l736-84L1024 0z" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>
