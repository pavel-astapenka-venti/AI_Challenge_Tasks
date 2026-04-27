<template>
  <svg :width="size" :height="size" viewBox="0 0 2048 2048">
    <path fill="currentColor" d="m1939 467l90 90l-1005 1005L19 557l90-90l915 915z" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 20 })
</script>
