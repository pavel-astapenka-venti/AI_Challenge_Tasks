<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  label: string
}>()

const visible = ref(false)
let showTimeout: ReturnType<typeof setTimeout> | null = null

function show() {
  showTimeout = setTimeout(() => {
    visible.value = true
  }, 300)
}

function hide() {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  visible.value = false
}
</script>

<template>
  <div
    class="tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot />
    <div class="tooltip" :class="{ 'tooltip-visible': visible }">
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #e2e8f0;
  color: #1e293b;
  font-size: 13px;
  font-weight: 400;
  padding: 6px 12px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.tooltip-visible {
  opacity: 1;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #e2e8f0;
}
</style>
