<script setup lang="ts">
import { ref, watch } from 'vue'
import { getCategories } from '../services/categories'
import { getActivityYears, type LeaderboardFilters } from '../services/leaderboard'
import IconSearch from './icons/IconSearch.vue'

const emit = defineEmits<{
  (e: 'update:filters', filters: LeaderboardFilters): void
}>()

const selectedYear = ref('All Years')
const selectedQuarter = ref('All Quarters')
const selectedCategory = ref('All Categories')
const searchQuery = ref('')

const years = ['All Years', ...getActivityYears()]
const quarters = ['All Quarters', 'Q1', 'Q2', 'Q3', 'Q4']
const categoryNames = ['All Categories', ...getCategories().map((c) => c.name)]

function emitFilters() {
  emit('update:filters', {
    year: selectedYear.value,
    quarter: selectedQuarter.value,
    category: selectedCategory.value,
    search: searchQuery.value,
  })
}

watch([selectedYear, selectedQuarter, selectedCategory, searchQuery], emitFilters)
</script>

<template>
  <div class="filters">
    <div class="filter-dropdowns">
      <select v-model="selectedYear" class="filter-select">
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
      <select v-model="selectedQuarter" class="filter-select">
        <option v-for="q in quarters" :key="q" :value="q">{{ q }}</option>
      </select>
      <select v-model="selectedCategory" class="filter-select">
        <option v-for="cat in categoryNames" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    <div class="search-wrapper">
      <IconSearch class="search-icon" />
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Search employee..."
      />
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
}

.filter-dropdowns {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 0.8125rem;
  cursor: pointer;
  appearance: auto;
}

.filter-select:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: -1px;
}

.search-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  background: var(--color-surface);
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-input:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: -1px;
}
</style>
