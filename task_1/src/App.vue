<script setup lang="ts">
import { ref, computed } from 'vue'
import LeaderboardHeader from './components/LeaderboardHeader.vue'
import LeaderboardFilters from './components/LeaderboardFilters.vue'
import LeaderboardPodium from './components/LeaderboardPodium.vue'
import LeaderboardList from './components/LeaderboardList.vue'
import { getUsers, type LeaderboardFilters as Filters } from './services/leaderboard'

const filters = ref<Filters>({
  year: 'All Years',
  quarter: 'All Quarters',
  category: 'All Categories',
  search: '',
})

const users = computed(() => getUsers(filters.value))
</script>

<template>
  <div class="leaderboard">
    <LeaderboardHeader />
    <LeaderboardFilters @update:filters="filters = $event" />
    <template v-if="users.length">
      <LeaderboardPodium :users="users.slice(0, 3)" />
      <LeaderboardList :users="users" />
    </template>
    <div v-else class="empty-state">
      <span class="empty-icon">ℹ</span>
      No activities found matching the current filters.
    </div>
  </div>
</template>

<style scoped>
.leaderboard {
  width: 100%;
}

.empty-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.empty-icon {
  font-size: 1rem;
}
</style>
