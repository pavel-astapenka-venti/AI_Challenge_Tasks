<script setup lang="ts">
import { ref, computed } from 'vue'
import IconSearch from './icons/IconSearch.vue'
import IconClear from './icons/IconClear.vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isFocused = ref(false)
const isHovered = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const hasValue = computed(() => props.modelValue.length > 0)
const hideIcon = computed(() =>
  isFocused.value || (isHovered.value && hasValue.value),
)

function clear() {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}
</script>

<template>
  <div
    class="search-wrapper"
    :class="{ active: isFocused }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="search-icon-wrapper" :class="{ hidden: hideIcon }">
      <IconSearch class="search-icon" />
    </div>
    <input
      ref="inputRef"
      :value="modelValue"
      type="text"
      class="search-input"
      :class="{ 'no-icon': hideIcon }"
      :placeholder="placeholder ?? 'Search...'"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <div v-if="hasValue" class="clear-btn" @mousedown.prevent="clear">
      <IconClear />
    </div>
  </div>
</template>

<style scoped>
.search-wrapper {
  max-height: 32px;
  flex: 1;
  min-width: 250px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon-wrapper {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%) scaleX(-1);
  color: var(--color-text-secondary);
  pointer-events: none;
  display: flex;
  align-items: center;
  width: 16px;
  overflow: hidden;
  transition: width 0.167s ease;
}

.search-icon-wrapper.hidden {
  width: 0;
}

.search-input {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.25rem;
  border: 1px solid #000000;
  border-radius: 2px;
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  background: #ebebed;
}

.search-input {
  transition: padding-left 0.167s ease;
}

.search-input.no-icon {
  padding-left: 0.75rem;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-input:focus {
  outline: 2px solid #29292b;
  outline-offset: -1px;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: 50%;
}

.clear-btn:hover {
  color: var(--color-text-primary);
}
</style>
