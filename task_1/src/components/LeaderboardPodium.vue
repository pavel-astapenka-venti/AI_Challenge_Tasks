<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '../types'
import IconStar from './icons/IconStar.vue'

const props = defineProps<{
  users: User[]
}>()

function score(user: User): number {
  return user.activities.reduce((sum, a) => sum + a.points, 0)
}

const podiumOrder = computed(() => {
  const [first, second, third] = props.users
  return [second, first, third].filter(Boolean) as User[]
})

const rankMap: Record<number, number[]> = {
  1: [1],
  2: [2, 1],
  3: [2, 1, 3],
}

const ranks = computed(() => rankMap[props.users.length] ?? [])
</script>

<template>
  <div class="podium-section" v-if="podiumOrder.length">
    <div class="podium-users">
      <div
        v-for="(user, idx) in podiumOrder"
        :key="user.id"
        class="podium-user"
        :class="['place-' + ranks[idx]]"
      >
        <div class="avatar-wrapper" :class="'ring-' + ranks[idx]">
          <img class="avatar" :src="user.avatarUrl" :alt="user.name" />
          <span class="badge" :class="'badge-' + ranks[idx]">{{ ranks[idx] }}</span>
        </div>
        <span class="name">{{ user.name }}</span>
        <span class="title">{{ user.title }} ({{ user.unit }})</span>
        <span class="score">
          <IconStar class="star-icon" />
          {{ score(user) }}
        </span>
      </div>
    </div>
    <div class="pedestals">
      <div v-if="ranks.includes(2)" class="pedestal pedestal-2">2</div>
      <div class="pedestal pedestal-1">1</div>
      <div v-if="ranks.includes(3)" class="pedestal pedestal-3">3</div>
    </div>
  </div>
</template>

<style scoped>
.podium-section {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 3rem 2rem 0;
  margin-bottom: 1.5rem;
  text-align: center;
  overflow: hidden;
}

.podium-users {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: end;
  gap: 1rem;
  padding-bottom: 1.5rem;
}

.podium-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.place-1 {
  order: 2;
}
.place-2 {
  order: 1;
}
.place-3 {
  order: 3;
}

/* Avatar */
.avatar-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid transparent;
}

.ring-1 .avatar {
  width: 100px;
  height: 100px;
  border-color: var(--color-badge-gold);
}

.ring-2 .avatar {
  width: 72px;
  height: 72px;
  border-color: var(--color-badge-silver);
}

.ring-3 .avatar {
  width: 72px;
  height: 72px;
  border-color: var(--color-badge-bronze);
}

/* Badge */
.badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-1 {
  background: var(--color-badge-gold);
}
.badge-2 {
  background: var(--color-badge-silver);
}
.badge-3 {
  background: var(--color-badge-bronze);
}

/* Text */
.name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.title {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.score {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-star);
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  padding: 0.15rem 0.75rem;
  margin-top: 0.25rem;
}

.star-icon {
  width: 14px;
  height: 14px;
}

/* Pedestals */
.pedestals {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.pedestal {
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
}

.pedestal-1 {
  background: var(--color-gold);
  height: 120px;
}

.pedestal-2 {
  background: var(--color-silver);
  height: 90px;
}

.pedestal-3 {
  background: var(--color-bronze);
  height: 75px;
}
</style>
