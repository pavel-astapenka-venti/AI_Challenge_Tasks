<script setup lang="ts">
import { ref, watch } from 'vue'
import { getCategories } from '../services/categories'
import { getActivityYears, type LeaderboardFilters } from '../services/leaderboard'
import FilterSelect from './FilterSelect.vue'
import SearchInput from './SearchInput.vue'

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
      <FilterSelect v-model="selectedYear" :options="years" size="sm" />
      <FilterSelect v-model="selectedQuarter" :options="quarters" size="sm" />
      <FilterSelect v-model="selectedCategory" :options="categoryNames" size="md" />
    </div>
    <SearchInput v-model="searchQuery" placeholder="Search employee..." />
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 24px;
  transition: all 0.2s;
}

.filters:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.filter-dropdowns {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
