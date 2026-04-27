<script setup lang="ts">
import { computed } from 'vue'
import type { PodiumUser } from '../types'
import IconStar from './icons/IconStar.vue'

const props = defineProps<{
  users: PodiumUser[]
}>()

function score(user: PodiumUser): number {
  return user.activities.reduce((sum, a) => sum + a.points, 0)
}

const podiumOrder = computed(() => {
  const sorted = [...props.users].sort((a, b) => {
    const order = [2, 1, 3]
    return order.indexOf(a.rank) - order.indexOf(b.rank)
  })
  return sorted
})
</script>

<template>
  <div class="podium" v-if="podiumOrder.length">
    <div
      v-for="(user, idx) in podiumOrder"
      :key="user.id"
      class="podium-column"
      :class="'podium-rank-' + user.rank"
    >
      <div class="podium-user">
        <div class="podium-avatar-container">
          <div
            class="podium-avatar"
            :style="{
              backgroundImage: `url(${user.avatarUrl})`,
              width: user.rank === 1 ? '112px' : '80px',
              height: user.rank === 1 ? '112px' : '80px',
            }"
          ></div>
          <div
            class="podium-rank-badge"
            :style="{
              width: user.rank === 1 ? '40px' : '32px',
              height: user.rank === 1 ? '40px' : '32px',
            }"
          >
            {{ user.rank }}
          </div>
        </div>
        <h3 class="podium-name">{{ user.name }}</h3>
        <p class="podium-role">{{ user.title }} ({{ user.unit }})</p>
        <div class="podium-score">
          <IconStar class="star-icon" />
          <span>{{ score(user) }}</span>
        </div>
      </div>
      <div class="podium-block">
        <div class="podium-block-top"></div>
        <span class="podium-rank-number">{{ user.rank }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.podium {
  align-items: flex-end;
  display: flex;
  gap: 24px;
  justify-content: center;
  margin: 0 auto 64px;
  max-width: 900px;
  padding: 32px 8px;
}

.podium-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 280px;
  position: relative;
}

.podium-rank-1 { order: 2; margin-top: -32px; }
.podium-rank-2 { order: 1; }
.podium-rank-3 { order: 3; }

/* User card above pedestal */
.podium-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
  z-index: 10;
}

/* Avatar */
.podium-avatar-container {
  margin-bottom: 12px;
  position: relative;
}

.podium-avatar {
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
}

.podium-rank-1 .podium-avatar {
  background-color: #86efac;
  border: 4px solid #fbbf24;
}

.podium-rank-2 .podium-avatar {
  background-color: #cbd5e1;
  border: 4px solid #fff;
}

.podium-rank-3 .podium-avatar {
  background-color: #5eead4;
  border: 4px solid #fff;
}

/* Rank badge */
.podium-rank-badge {
  position: absolute;
  bottom: -8px;
  right: -4px;
  border-radius: 50%;
  border: 4px solid #fff;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.podium-rank-1 .podium-rank-badge {
  background: var(--color-badge-gold);
  font-size: 18px;
}

.podium-rank-2 .podium-rank-badge {
  background: var(--color-badge-silver);
  font-size: 14px;
}

.podium-rank-3 .podium-rank-badge {
  background: var(--color-badge-bronze);
  font-size: 14px;
}

/* Name */
.podium-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 4px;
  text-align: center;
}

.podium-rank-1 .podium-name {
  font-size: 24px;
}

/* Role */
.podium-role {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0 0 8px;
}

/* Score pill */
.podium-score {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 18px;
  font-weight: 700;
  padding: 6px 16px;
  color: var(--color-accent);
}

.podium-rank-1 .podium-score {
  background: #fef9c3;
  border-color: #fde047;
  color: #ca8a04;
  font-size: 20px;
  padding: 8px 20px;
}

.star-icon {
  color: inherit;
  flex-shrink: 0;
}

.podium-score .star-icon {
  width: 16px;
  height: 16px;
}

.podium-rank-1 .podium-score .star-icon {
  width: 18px;
  height: 18px;
}

/* Pedestal blocks */
.podium-block {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  padding-top: 16px;
  position: relative;
  width: 100%;
  border-radius: var(--radius) var(--radius) 0 0;
}

.podium-rank-1 .podium-block {
  background: linear-gradient(180deg, #fef3c7, #fde68a);
  border-top: 2px solid #fde047;
  height: 160px;
}

.podium-rank-2 .podium-block {
  background: linear-gradient(180deg, #e2e8f0, #cbd5e1);
  border-top: 2px solid #cbd5e1;
  height: 128px;
}

.podium-rank-3 .podium-block {
  background: linear-gradient(180deg, #e2e8f0, #cbd5e1);
  border-top: 2px solid #cbd5e1;
  height: 96px;
}

.podium-block-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
}

.podium-rank-1 .podium-block-top {
  background: #fde047;
}

.podium-rank-2 .podium-block-top,
.podium-rank-3 .podium-block-top {
  background: #cbd5e1;
}

.podium-rank-number {
  font-size: 96px;
  font-weight: 900;
  color: rgba(148, 163, 184, 0.2);
  user-select: none;
  position: relative;
}

.podium-rank-1 .podium-rank-number {
  color: rgba(234, 179, 8, 0.2);
  font-size: 112px;
}

.podium-rank-3 .podium-rank-number {
  top: -16px;
}
</style>
