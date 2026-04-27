<script setup lang="ts">
import type { RankedUser } from '../types'
import LeaderboardUserRow from './LeaderboardUserRow.vue'

const props = defineProps<{
  users: RankedUser[]
}>()
</script>

<template>
  <div class="list-section">
    <LeaderboardUserRow
      v-for="user in users"
      :key="user.id"
      :user="user"
      :rank="user.rank"
    />
  </div>
</template>

<style scoped>
.list-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
