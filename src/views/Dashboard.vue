<template>
  <div class="dashboard">
    <h1>Tableau de Bord</h1>

    <div class="stats-grid">
      <!-- Total des tâches -->
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <h3>Total des tâches</h3>
          <p class="stat-number">{{ totalTasks }}</p>
        </div>
      </div>

      <!-- Tâches en cours -->
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <h3>Tâches en cours</h3>
          <p class="stat-number">{{ inProgressTasks }}</p>
        </div>
      </div>

      <!-- Tâches terminées -->
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>Tâches terminées</h3>
          <p class="stat-number">{{ completedTasks }}</p>
        </div>
      </div>

      <!-- Tâches à venir -->
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <h3>Tâches à venir</h3>
          <p class="stat-number">{{ upcomingTasks }}</p>
        </div>
      </div>
    </div>

    <!-- Répartition par catégorie -->
    <div class="category-stats">
      <h2>Répartition par catégorie</h2>
      <div class="category-list">
        <div v-for="category in categoryStats" :key="category.id" class="category-item">
          <div class="category-color" :style="{ backgroundColor: category.color }"></div>
          <div class="category-info">
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.count }} tâches</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tâches récentes -->
    <div class="recent-tasks">
      <h2>Tâches récentes</h2>
      <div class="tasks-list">
        <div v-for="task in recentTasks" :key="task.id" class="task-item">
          <div class="task-info">
            <h4>{{ task.name }}</h4>
            <p>{{ task.description }}</p>
          </div>
          <div class="task-meta">
            <span class="task-status" :class="task.status">{{ task.status }}</span>
            <span class="task-date">{{ formatDate(task.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()
    const tasks = computed(() => store.getters.getAllTasks)
    const categories = computed(() => store.getters.getCategories)

    // Statistiques générales
    const totalTasks = computed(() => tasks.value.length)
    const inProgressTasks = computed(() => tasks.value.filter(task => task.status === 'en-cours').length)
    const completedTasks = computed(() => tasks.value.filter(task => task.status === 'terminé').length)
    const upcomingTasks = computed(() => tasks.value.filter(task => task.status === 'à-venir').length)

    // Statistiques par catégorie
    const categoryStats = computed(() => {
      return categories.value.map(category => ({
        ...category,
        count: tasks.value.filter(task => task.category === category.id).length
      }))
    })

    // Tâches récentes (5 dernières)
    const recentTasks = computed(() => {
      return [...tasks.value]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('fr-FR')
    }

    return {
      totalTasks,
      inProgressTasks,
      completedTasks,
      upcomingTasks,
      categoryStats,
      recentTasks,
      formatDate
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
}

h2 {
  color: #34495e;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2em;
}

.stat-content h3 {
  margin: 0;
  color: #666;
  font-size: 1em;
}

.stat-number {
  margin: 5px 0 0;
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
}

.category-stats,
.recent-tasks {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.category-list {
  display: grid;
  gap: 15px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 4px;
  background: #f8f9fa;
}

.category-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.category-name {
  font-weight: 500;
}

.category-count {
  color: #666;
}

.tasks-list {
  display: grid;
  gap: 15px;
}

.task-item {
  padding: 15px;
  border-radius: 4px;
  background: #f8f9fa;
}

.task-info h4 {
  margin: 0 0 5px;
  color: #2c3e50;
}

.task-info p {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.task-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  color: white;
}

.task-status.à-venir {
  background-color: #2196F3;
}

.task-status.en-cours {
  background-color: #FFC107;
}

.task-status.terminé {
  background-color: #4CAF50;
}

.task-date {
  color: #666;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 