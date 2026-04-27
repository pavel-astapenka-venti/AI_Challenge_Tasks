<template>
  <header class="leaderboard-header">
    <div class="header-content">
      <h2>Leaderboard</h2>
      <p class="subtitle">Top performers based on contributions and activity</p>
    </div>
  </header>
</template>

<style scoped>
.leaderboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
}

.header-content {
  flex: 1;
}

.header-content h2 {
  font-size: 30px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px;
}

.subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}
</style>
