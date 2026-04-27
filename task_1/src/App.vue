<script setup lang="ts">
import { ref, computed } from 'vue'
import LeaderboardHeader from './components/LeaderboardHeader.vue'
import LeaderboardFilters from './components/LeaderboardFilters.vue'
import LeaderboardPodium from './components/LeaderboardPodium.vue'
import LeaderboardList from './components/LeaderboardList.vue'
import IconPublicSpeaking from './components/icons/IconInfo.vue'
import { getUsers, type LeaderboardFilters as Filters } from './services/leaderboard'

const filters = ref<Filters>({
  year: 'All Years',
  quarter: 'All Quarters',
  category: 'All Categories',
  search: '',
})

const users = computed(() => {
  const allRanked = getUsers({ ...filters.value, search: '' })
    .map((u, i) => ({ ...u, rank: i + 1 }))
  if (!filters.value.search) return allRanked
  const q = filters.value.search.toLowerCase()
  return allRanked.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.title.toLowerCase().includes(q) ||
      u.unit.toLowerCase().includes(q),
  )
})
const podiumUsers = computed(() => {
  const top3 = getUsers({ ...filters.value, search: '' })
    .slice(0, 3)
    .map((u, i) => ({ ...u, rank: i + 1 }))
  if (!filters.value.search) return top3
  const q = filters.value.search.toLowerCase()
  return top3.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.title.toLowerCase().includes(q) ||
      u.unit.toLowerCase().includes(q),
  )
})
</script>

<template>
  <div class="leaderboard">
    <LeaderboardHeader />
    <LeaderboardFilters @update:filters="filters = $event" />
    <template v-if="users.length || podiumUsers.length">
      <LeaderboardPodium :users="podiumUsers" />
      <LeaderboardList :users="users" />
    </template>
    <div v-else class="empty-state">
      <IconPublicSpeaking class="empty-icon" :size="16"/>
      No activities found matching the current filters.
    </div>
  </div>
</template>

<style scoped>
.leaderboard {
  width: 100%;
  background: var(--color-background-leaderboard);
  padding: 24px;
}

.empty-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 16px;
  background: #f3f2f1;
  color: #323130;
  font-size: 12px;
}

.empty-icon {
  color: #605e5c;
}
</style>
