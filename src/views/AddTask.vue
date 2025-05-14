<template>
  <div class="add-task">
    <h1>Ajouter une nouvelle tâche</h1>
    
    <form @submit.prevent="handleSubmit" class="task-form">
      <div class="form-group">
        <label for="name">Nom de la tâche</label>
        <input
          type="text"
          id="name"
          v-model="task.name"
          required
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="task.description"
          required
          class="form-control"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="status">Statut</label>
        <select id="status" v-model="task.status" required class="form-control">
          <option value="à-venir">À venir</option>
          <option value="en-cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>
      </div>

      <div class="form-group">
        <label for="category">Catégorie</label>
        <select id="category" v-model="task.category" required class="form-control">
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="priority">Priorité</label>
        <select id="priority" v-model="task.priority" required class="form-control">
          <option v-for="priority in priorities" :key="priority.id" :value="priority.id">
            {{ priority.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="dueDate">Date d'échéance</label>
        <input
          type="date"
          id="dueDate"
          v-model="task.dueDate"
          required
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="assignees">Assignés (séparés par des virgules)</label>
        <input
          type="text"
          id="assignees"
          v-model="assigneesInput"
          required
          class="form-control"
          placeholder="ex: John Doe, Jane Smith"
        >
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Ajout en cours...' : 'Ajouter la tâche' }}
        </button>
        <router-link to="/" class="btn btn-secondary">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'AddTask',
  setup() {
    const store = useStore()
    const router = useRouter()
    const isLoading = computed(() => store.getters.isLoading)
    const categories = computed(() => store.getters.getCategories)
    const priorities = computed(() => store.getters.getPriorities)

    const task = ref({
      name: '',
      description: '',
      status: 'à-venir',
      category: 1,
      priority: 2,
      dueDate: new Date().toISOString().split('T')[0],
      assignees: []
    })

    const assigneesInput = ref('')

    const handleSubmit = async () => {
      // Convertir la chaîne d'assignés en tableau
      task.value.assignees = assigneesInput.value
        .split(',')
        .map(assignee => assignee.trim())
        .filter(assignee => assignee)

      try {
        await store.dispatch('addTask', task.value)
        router.push('/')
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche:', error)
      }
    }

    return {
      task,
      assigneesInput,
      isLoading,
      categories,
      priorities,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.add-task {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.task-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f44336;
  color: white;
}
</style> 