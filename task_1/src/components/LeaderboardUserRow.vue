<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../types'
import { getCategories } from '../services/categories'
import IconStar from './icons/IconStar.vue'
import IconChevron from './icons/IconChevron.vue'

const categories = getCategories()

const props = defineProps<{
  user: User
  rank: number
}>()

const expanded = ref(false)

const totalScore = computed(() =>
  props.user.activities.reduce((sum, a) => sum + a.points, 0),
)

const categoryStats = computed(() =>
  categories
    .map((cat) => ({
      name: cat.name,
      icon: cat.icon,
      count: props.user.activities.filter((a) => a.category === cat.name).length,
    }))
    .filter((s) => s.count > 0),
)
</script>

<template>
  <div class="user-row" :class="{ expanded }">
    <div class="user-summary" @click="expanded = !expanded">
      <span class="rank">{{ rank }}</span>
      <img class="avatar" :src="user.avatarUrl" :alt="user.name" />
      <div class="user-info">
        <span class="user-name">{{ user.name }}</span>
        <span class="user-title">{{ user.title }} ({{ user.unit }})</span>
      </div>
      <div class="stats">
        <div class="stat" v-for="stat in categoryStats" :key="stat.name">
          <component :is="stat.icon" />
          <span>{{ stat.count }}</span>
        </div>
      </div>
      <div class="score-section">
        <span class="score-label">TOTAL</span>
        <span class="score">
          <IconStar class="star-icon" />
          {{ totalScore }}
        </span>
      </div>
      <button class="expand-btn" :class="{ rotated: expanded }">
        <IconChevron />
      </button>
    </div>

    <div v-if="expanded" class="user-details">
      <h4 class="details-title">RECENT ACTIVITY</h4>
      <table class="activity-table">
        <thead>
          <tr>
            <th>ACTIVITY</th>
            <th>CATEGORY</th>
            <th>DATE</th>
            <th>POINTS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(activity, index) in user.activities" :key="index">
            <td>{{ activity.title }}</td>
            <td><span class="category-badge">{{ activity.category }}</span></td>
            <td>{{ activity.date }}</td>
            <td class="points-cell">+{{ activity.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.user-row {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.user-row.expanded {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3), var(--shadow);
}

.user-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  user-select: none;
}

.user-summary:hover {
  background: #f9fafb;
}

.rank {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  min-width: 1.5rem;
  text-align: center;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-title {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.stats {
  display: flex;
  gap: 0.75rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
}

.score-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 5rem;
}

.score-label {
  font-size: 0.625rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-star);
}

.star-icon {
  flex-shrink: 0;
}

.expand-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}

.expand-btn.rotated {
  transform: rotate(180deg);
}

.user-details {
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid var(--color-border);
}

.details-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 0 0.75rem;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.activity-table th {
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.activity-table td {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.activity-table tr:last-child td {
  border-bottom: none;
}

.category-badge {
  display: inline-block;
  padding: 0.2rem 0.75rem;
  background: #f0f4f8;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.points-cell {
  font-weight: 600;
  color: var(--color-accent);
}
</style>
