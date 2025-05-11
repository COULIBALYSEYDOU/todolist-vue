<template>
  <div class="home">
    <h1>Bienvenue sur notre application de gestion de tâches</h1>
    
    <div class="actions">
      <router-link to="/add-task" class="btn btn-primary">Ajouter une tâche</router-link>
    </div>

    <div class="tasks-list" v-if="tasks.length">
      <div v-for="task in tasks" :key="task.id" class="task-card">
        <h3>{{ task.name }}</h3>
        <p>{{ task.description }}</p>
        <div class="task-status" :class="task.status">
          {{ task.status }}
        </div>
        <div class="task-assignees">
          <strong>Assignés :</strong> {{ task.assignees.join(', ') }}
        </div>
        <div class="task-actions">
          <router-link :to="{ name: 'EditTask', params: { id: task.id }}" class="btn btn-edit">
            Modifier
          </router-link>
          <button @click="deleteTask(task.id)" class="btn btn-delete">
            Supprimer
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-tasks">
      Aucune tâche pour le moment
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Home',
  setup() {
    const store = useStore()
    const tasks = computed(() => store.getters.getAllTasks)

    const deleteTask = (taskId) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        store.dispatch('deleteTask', taskId)
      }
    }

    return {
      tasks,
      deleteTask
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.actions {
  margin: 20px 0;
}

.tasks-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.task-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 0.9em;
}

.task-status.à-venir {
  background: #ffd700;
}

.task-status.en-cours {
  background: #87ceeb;
}

.task-status.terminé {
  background: #90ee90;
}

.task-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-edit {
  background: #2196F3;
  color: white;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.no-tasks {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style> 