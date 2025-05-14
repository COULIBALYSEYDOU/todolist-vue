<template>
  <div class="home">
    <h1>Bienvenue sur notre application de gestion de tâches</h1>
    
    <div class="actions">
      <router-link to="/add-task" class="btn btn-primary">Ajouter une tâche</router-link>
      <router-link to="/categories" class="btn btn-secondary">Gérer les catégories</router-link>
    </div>

    <div class="filters">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher une tâche..."
          class="search-input"
        >
      </div>
      
      <div class="filter-options">
        <select v-model="statusFilter" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="à-venir">À venir</option>
          <option value="en-cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>

        <select v-model="categoryFilter" class="filter-select">
          <option value="">Toutes les catégories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>

        <select v-model="priorityFilter" class="filter-select">
          <option value="">Toutes les priorités</option>
          <option v-for="priority in priorities" :key="priority.id" :value="priority.id">
            {{ priority.name }}
          </option>
        </select>

        <select v-model="sortBy" class="filter-select">
          <option value="name">Trier par nom</option>
          <option value="status">Trier par statut</option>
          <option value="priority">Trier par priorité</option>
          <option value="dueDate">Trier par date d'échéance</option>
          <option value="date">Trier par date de création</option>
        </select>
      </div>
    </div>

    <div class="tasks-list" v-if="filteredTasks.length">
      <div class="list-header">
        <div class="list-cell name">Nom</div>
        <div class="list-cell category">Catégorie</div>
        <div class="list-cell priority">Priorité</div>
        <div class="list-cell status">Statut</div>
        <div class="list-cell due-date">Échéance</div>
        <div class="list-cell assignees">Assignés</div>
        <div class="list-cell actions">Actions</div>
      </div>
      
      <div v-for="task in filteredTasks" :key="task.id" class="list-row">
        <div class="list-cell name">
          <div class="task-name">{{ task.name }}</div>
          <div class="task-description">{{ task.description }}</div>
        </div>
        <div class="list-cell category">
          <span class="task-category" :style="{ backgroundColor: getCategoryColor(task.category) }">
            {{ getCategoryName(task.category) }}
          </span>
        </div>
        <div class="list-cell priority">
          <span class="task-priority" :style="{ backgroundColor: getPriorityColor(task.priority) }">
            {{ getPriorityName(task.priority) }}
          </span>
        </div>
        <div class="list-cell status">
          <span class="task-status" :class="task.status">
            {{ task.status }}
          </span>
        </div>
        <div class="list-cell due-date">
          <span :class="{ 'overdue': isOverdue(task.dueDate) }">
            {{ formatDate(task.dueDate) }}
          </span>
        </div>
        <div class="list-cell assignees">
          {{ task.assignees.join(', ') }}
        </div>
        <div class="list-cell actions">
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
      {{ searchQuery ? 'Aucune tâche ne correspond à votre recherche' : 'Aucune tâche pour le moment' }}
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Home',
  setup() {
    const store = useStore()
    const tasks = computed(() => store.getters.getAllTasks)
    const categories = computed(() => store.getters.getCategories)
    const priorities = computed(() => store.getters.getPriorities)
    
    const searchQuery = ref('')
    const statusFilter = ref('')
    const categoryFilter = ref('')
    const priorityFilter = ref('')
    const sortBy = ref('name')

    const getCategoryName = (categoryId) => {
      const category = categories.value.find(c => c.id === categoryId)
      return category ? category.name : 'Non catégorisé'
    }

    const getCategoryColor = (categoryId) => {
      const category = categories.value.find(c => c.id === categoryId)
      return category ? category.color : '#607D8B'
    }

    const getPriorityName = (priorityId) => {
      const priority = priorities.value.find(p => p.id === priorityId)
      return priority ? priority.name : 'Non priorisé'
    }

    const getPriorityColor = (priorityId) => {
      const priority = priorities.value.find(p => p.id === priorityId)
      return priority ? priority.color : '#607D8B'
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('fr-FR')
    }

    const isOverdue = (dateString) => {
      return new Date(dateString) < new Date() && dateString
    }

    const filteredTasks = computed(() => {
      let result = [...tasks.value]

      // Filtrage par recherche
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(task => 
          task.name.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.assignees.some(assignee => assignee.toLowerCase().includes(query))
        )
      }

      // Filtrage par statut
      if (statusFilter.value) {
        result = result.filter(task => task.status === statusFilter.value)
      }

      // Filtrage par catégorie
      if (categoryFilter.value) {
        result = result.filter(task => task.category === categoryFilter.value)
      }

      // Filtrage par priorité
      if (priorityFilter.value) {
        result = result.filter(task => task.priority === priorityFilter.value)
      }

      // Tri
      result.sort((a, b) => {
        switch (sortBy.value) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'status':
            return a.status.localeCompare(b.status)
          case 'priority':
            return b.priority - a.priority
          case 'dueDate':
            return new Date(a.dueDate) - new Date(b.dueDate)
          case 'date':
            return b.id - a.id
          default:
            return 0
        }
      })

      return result
    })

    const deleteTask = (taskId) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        store.dispatch('deleteTask', taskId)
      }
    }

    return {
      tasks,
      categories,
      priorities,
      filteredTasks,
      searchQuery,
      statusFilter,
      categoryFilter,
      priorityFilter,
      sortBy,
      getCategoryName,
      getCategoryColor,
      getPriorityName,
      getPriorityColor,
      formatDate,
      isOverdue,
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

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
}

.actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary {
  background-color: #607D8B;
  color: white;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.filters {
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-box {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.filter-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.filter-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.tasks-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin: 0 -20px;
  padding: 0 20px;
  width: calc(100% + 40px);
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 2fr;
  padding: 15px;
  background-color: #f5f5f5;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  min-width: 1200px;
}

.list-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 2fr;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  align-items: center;
  min-width: 1200px;
}

.list-row:hover {
  background-color: #f9f9f9;
}

.list-cell {
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-cell.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  min-width: 200px;
  padding-right: 20px;
}

.btn-edit,
.btn-delete {
  padding: 8px 16px;
  font-size: 14px;
  white-space: nowrap;
  min-width: 90px;
  text-align: center;
}

.task-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.task-description {
  font-size: 0.9em;
  color: #666;
  white-space: normal;
}

.task-category,
.task-priority,
.task-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 0.9em;
}

.task-status {
  text-transform: capitalize;
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

.overdue {
  color: #f44336;
  font-weight: 500;
}

.no-tasks {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #666;
}

@media (max-width: 768px) {
  .list-header,
  .list-row {
    grid-template-columns: 1fr;
    gap: 10px;
    min-width: auto;
  }

  .list-cell {
    padding: 5px 0;
  }

  .list-cell.actions {
    justify-content: flex-start;
    min-width: auto;
    padding-right: 0;
  }

  .btn-edit,
  .btn-delete {
    width: auto;
    min-width: 90px;
  }

  .filter-options {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}
</style> 