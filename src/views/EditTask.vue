<template>
  <div class="edit-task">
    <h1>Modifier la tâche</h1>
    
    <form @submit.prevent="handleSubmit" class="task-form" v-if="task">
      <div class="form-group">
        <label for="name">Nom de la tâche</label>
        <input
          type="text"
          id="name"
          v-model="task.name"
          required
          class="form-control"
          :class="{ 'error': errors.name }"
        >
        <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="task.description"
          required
          class="form-control"
          :class="{ 'error': errors.description }"
        ></textarea>
        <span class="error-message" v-if="errors.description">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label for="status">Statut</label>
        <select
          id="status"
          v-model="task.status"
          required
          class="form-control"
          :class="{ 'error': errors.status }"
        >
          <option value="à-venir">À venir</option>
          <option value="en-cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>
        <span class="error-message" v-if="errors.status">{{ errors.status }}</span>
      </div>

      <div class="form-group">
        <label for="assignees">Personnes assignées</label>
        <input
          type="text"
          id="assignees"
          v-model="assigneesInput"
          placeholder="Séparez les noms par des virgules"
          class="form-control"
          :class="{ 'error': errors.assignees }"
        >
        <span class="error-message" v-if="errors.assignees">{{ errors.assignees }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
        <router-link to="/" class="btn btn-secondary">Annuler</router-link>
      </div>
    </form>
    <div v-else class="loading">
      Chargement...
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'EditTask',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    const task = ref(null)
    const assigneesInput = ref('')
    const errors = ref({})

    const loadTask = () => {
      const tasks = store.getters.getAllTasks
      const foundTask = tasks.find(t => t.id === Number(props.id))
      if (foundTask) {
        task.value = { ...foundTask }
        assigneesInput.value = foundTask.assignees.join(', ')
      } else {
        router.push('/')
      }
    }

    const validateForm = () => {
      errors.value = {}
      
      if (!task.value.name.trim()) {
        errors.value.name = 'Le nom de la tâche est requis'
      }
      
      if (!task.value.description.trim()) {
        errors.value.description = 'La description est requise'
      }
      
      if (!task.value.status) {
        errors.value.status = 'Le statut est requis'
      }

      const assignees = assigneesInput.value.split(',').map(name => name.trim()).filter(name => name)
      if (assignees.length === 0) {
        errors.value.assignees = 'Au moins une personne doit être assignée'
      } else {
        task.value.assignees = assignees
      }

      return Object.keys(errors.value).length === 0
    }

    const handleSubmit = () => {
      if (validateForm()) {
        store.dispatch('updateTask', task.value)
        router.push('/')
      }
    }

    onMounted(loadTask)

    return {
      task,
      assigneesInput,
      errors,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.edit-task {
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

label {
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

.form-control.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 0.9em;
  margin-top: 5px;
  display: block;
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

.btn-secondary {
  background: #9e9e9e;
  color: white;
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style> 