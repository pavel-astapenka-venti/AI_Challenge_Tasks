<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import IconChevron from './icons/IconChevron.vue'

type FilterSize = 'sm' | 'md'

const props = withDefaults(defineProps<{
  modelValue: string
  options: string[]
  size?: FilterSize
}>(), {
  size: 'sm',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const open = ref(false)
const selectRef = ref<HTMLElement | null>(null)

function toggle() {
  open.value = !open.value
}

function select(option: string) {
  emit('update:modelValue', option)
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      open.value = true
    }
    return
  }

  const currentIndex = props.options.indexOf(props.modelValue)

  switch (e.key) {
    case 'Escape':
      e.preventDefault()
      open.value = false
      break
    case 'ArrowDown':
      e.preventDefault()
      if (currentIndex < props.options.length - 1) {
        emit('update:modelValue', props.options[currentIndex + 1]!)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (currentIndex > 0) {
        emit('update:modelValue', props.options[currentIndex - 1]!)
      }
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      open.value = false
      break
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div
    ref="selectRef"
    class="filter-select"
    :class="`size-${size}`"
    tabindex="0"
    role="combobox"
    :aria-expanded="open"
    aria-haspopup="listbox"
    @click="toggle"
    @keydown="onKeydown"
  >
    <span class="filter-select-label">{{ modelValue }}</span>
    <IconChevron class="filter-select-chevron" :class="{ open }" :size="12" />
    <ul v-if="open" class="filter-select-dropdown" role="listbox">
      <li
        v-for="option in options"
        :key="option"
        class="filter-select-option"
        :class="{ selected: option === modelValue }"
        role="option"
        :aria-selected="option === modelValue"
        @click.stop="select(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.filter-select {
  max-height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid #000000;
  border-radius: 2px;
  box-sizing: border-box;
  background: #ebebed;
  color: #373737;
  cursor: pointer;
  user-select: none;
}

.filter-select.size-sm {
  width: 120px;
}

.filter-select.size-md {
  width: 150px;
}

.filter-select:focus {
  outline: 2px solid #29292b;
  outline-offset: -1px;
}

.filter-select-label {
  display: block;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-select-chevron {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.filter-select-chevron.open {
  transform: rotate(180deg);
}

.filter-select-dropdown {
  position: absolute;
  top: calc(100% + 1px);
  left: -1px;
  right: -1px;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #ebebed;
  border-radius: 2px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
}

.filter-select-option {
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-select-option:hover {
  background: #dddde0;
}

.filter-select-option.selected {
  font-weight: 600;
  background: #d0d0d4;
}
</style>
