<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../types'
import { getCategories } from '../services/categories'
import IconStar from './icons/IconStar.vue'
import IconChevron from './icons/IconChevron.vue'
import CategoryTooltip from './CategoryTooltip.vue'

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
  <div class="user-row-container" :class="{ expanded }">
    <div class="row">
      <div class="row-main">
        <div class="row-left">
          <span class="rank">{{ rank }}</span>
          <div
            class="avatar"
            :style="{ backgroundImage: `url(${user.avatarUrl})` }"
          ></div>
          <div class="info">
            <h3 class="user-name">{{ user.name }}</h3>
            <span class="user-role">{{ user.title }} ({{ user.unit }})</span>
          </div>
        </div>
        <div class="row-right">
          <div class="category-stats">
            <CategoryTooltip v-for="stat in categoryStats" :key="stat.name" :label="stat.name">
              <div class="category-stat">
                <component :is="stat.icon" class="category-stat-icon" />
                <span class="category-stat-count">{{ stat.count }}</span>
              </div>
            </CategoryTooltip>
          </div>
          <div class="total-section">
            <span class="total-label">TOTAL</span>
            <div class="score">
              <IconStar class="star-icon" />
              <span>{{ totalScore }}</span>
            </div>
          </div>
          <button class="expand-button" :aria-label="expanded ? 'Collapse' : 'Expand'" @click="expanded = !expanded">
            <IconChevron :class="{ rotated: expanded }" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="expanded" class="details">
      <h4 class="details-title">RECENT ACTIVITY</h4>
      <div class="table-wrapper">
        <table class="activity-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Category</th>
              <th>Date</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(activity, index) in user.activities" :key="index">
              <td class="activity-name">{{ activity.title }}</td>
              <td><span class="category-badge">{{ activity.category }}</span></td>
              <td class="activity-date">{{ activity.date }}</td>
              <td class="activity-points">+{{ activity.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-row-container {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: all 0.2s;
}

.user-row-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-row-container.expanded {
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.row {
  padding: 20px 24px;
}

.row-main {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
}

.row-left {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 24px;
}

.rank {
  font-size: 24px;
  font-weight: 700;
  color: #94a3b8;
  min-width: 32px;
  text-align: center;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: #fbbf24;
  flex-shrink: 0;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.user-role {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.row-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.category-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.category-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.category-stat-icon {
  color: var(--color-accent);
  font-size: 20px;
}

.category-stat-count {
  color: #475569;
  font-size: 12px;
  font-weight: 600;
}

.total-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  border-left: 1px solid var(--color-border);
  padding-left: 24px;
}

.total-label {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.score {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-accent);
}

.star-icon {
  color: inherit;
  flex-shrink: 0;
}

.expand-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  color: var(--color-accent);
  cursor: pointer;
  padding: 8px;
  transition: background 0.2s;
}

.expand-button:hover {
  background: #e2e8f0;
}

.user-row-container.expanded .expand-button {
  background: #e0f2fe;
}

.expand-button .rotated {
  transform: rotate(180deg);
}

.details {
  background: #f8fafc;
  border-top: 1px solid var(--color-border);
  padding: 24px;
  border-bottom-left-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
}

.details-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px;
}

.table-wrapper {
  overflow-x: auto;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table thead tr {
  border-bottom: 2px solid var(--color-border);
}

.activity-table thead th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 8px;
}

.activity-table thead th:last-child {
  text-align: right;
}

.activity-table tbody tr {
  transition: background-color 0.2s;
}

.activity-table tbody tr:hover {
  background: #f1f5f9;
}

.activity-table tbody td {
  padding: 16px 8px;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}

.activity-table tbody tr:last-child td {
  border-bottom: none;
}

.activity-name {
  color: #1e293b;
  font-weight: 600;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: #e2e8f0;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.activity-date {
  color: var(--color-text-secondary);
}

.activity-points {
  color: var(--color-accent);
  font-weight: 700;
  text-align: right;
}
</style>
