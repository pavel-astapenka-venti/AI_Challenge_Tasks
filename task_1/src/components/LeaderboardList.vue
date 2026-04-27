<script setup lang="ts">
import type { User } from '../types'
import LeaderboardUserRow from './LeaderboardUserRow.vue'

const props = defineProps<{
  users: User[]
}>()
</script>

<template>
  <div class="list-section">
    <LeaderboardUserRow
      v-for="(user, index) in users"
      :key="user.id"
      :user="user"
      :rank="index + 1"
    />
  </div>
</template>

<style scoped>
.list-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
