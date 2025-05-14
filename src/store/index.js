import { createStore } from 'vuex'
import notifications from './modules/notifications'

// Fonction pour charger les tâches depuis le localStorage
const loadTasks = () => {
  const tasks = localStorage.getItem('tasks')
  return tasks ? JSON.parse(tasks) : []
}

// Fonction pour sauvegarder les tâches dans le localStorage
const saveTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Fonction pour charger les catégories depuis le localStorage
const loadCategories = () => {
    const categories = localStorage.getItem('categories')
    return categories ? JSON.parse(categories) : [
      { id: 1, name: 'Travail', color: '#4CAF50' },
      { id: 2, name: 'Personnel', color: '#2196F3' },
      { id: 3, name: 'Études', color: '#9C27B0' },
      { id: 4, name: 'Santé', color: '#FF9800' },
      { id: 5, name: 'Autre', color: '#607D8B' }
    ]
  }
// Fonction pour sauvegarder les catégories dans le localStorage
const saveCategories = (categories) => {
  localStorage.setItem('categories', JSON.stringify(categories))
}

export default createStore({
  modules: {
    notifications
  },
  state: {
    tasks: loadTasks(),
    loading: false,
    error: null,
    categories: loadCategories(),
    priorities: [
      { id: 1, name: 'Basse', color: '#4CAF50' },
      { id: 2, name: 'Moyenne', color: '#FFC107' },
      { id: 3, name: 'Haute', color: '#F44336' }
    ]
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    ADD_TASK(state, task) {
      state.tasks.push(task)
      saveTasks(state.tasks)
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask)
        saveTasks(state.tasks)
      }
    },
    DELETE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId)
      saveTasks(state.tasks)
    },
    ADD_CATEGORY(state, category) {
      const newCategory = {
        ...category,
        id: Date.now()
      }
      state.categories.push(newCategory)
      saveCategories(state.categories)
    },
    UPDATE_CATEGORY(state, updatedCategory) {
      const index = state.categories.findIndex(category => category.id === updatedCategory.id)
      if (index !== -1) {
        state.categories.splice(index, 1, updatedCategory)
        saveCategories(state.categories)
      }
    },
    DELETE_CATEGORY(state, categoryId) {
      state.categories = state.categories.filter(category => category.id !== categoryId)
      saveCategories(state.categories)
    },
    ADD_PRIORITY(state, priority) {
      state.priorities.push(priority)
    }
  },
  actions: {
    async addTask({ commit, dispatch }, task) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('ADD_TASK', { 
          ...task, 
          id: Date.now(),
          createdAt: new Date().toISOString()
        })
        dispatch('notifications/success', 'Tâche ajoutée avec succès')
      } catch (error) {
        commit('SET_ERROR', error.message)
        dispatch('notifications/error', 'Erreur lors de l\'ajout de la tâche')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async updateTask({ commit, dispatch }, task) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('UPDATE_TASK', {
          ...task,
          updatedAt: new Date().toISOString()
        })
        dispatch('notifications/success', 'Tâche mise à jour avec succès')
      } catch (error) {
        commit('SET_ERROR', error.message)
        dispatch('notifications/error', 'Erreur lors de la mise à jour de la tâche')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async deleteTask({ commit, dispatch }, taskId) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('DELETE_TASK', taskId)
        dispatch('notifications/success', 'Tâche supprimée avec succès')
      } catch (error) {
        commit('SET_ERROR', error.message)
        dispatch('notifications/error', 'Erreur lors de la suppression de la tâche')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async addCategory({ commit, dispatch }, category) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('ADD_CATEGORY', category)
        dispatch('notifications/success', 'Catégorie ajoutée avec succès')
      } catch (error) {
        commit('SET_ERROR', error.message)
        dispatch('notifications/error', 'Erreur lors de l\'ajout de la catégorie')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async updateCategory({ commit, dispatch }, category) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('UPDATE_CATEGORY', category)
        dispatch('notifications/success', 'Catégorie mise à jour avec succès')
      } catch (error) {
        commit('SET_ERROR', error.message)
        dispatch('notifications/error', 'Erreur lors de la mise à jour de la catégorie')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async deleteCategory({ commit, dispatch }, categoryId) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('DELETE_CATEGORY', categoryId)
        dispatch('notifications/success', 'Catégorie supprimée avec succès')
      } catch (error) {
        commit('SET_ERROR', error.message)
        dispatch('notifications/error', 'Erreur lors de la suppression de la catégorie')
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {
    getAllTasks: state => state.tasks,
    getCategories: state => state.categories,
    getPriorities: state => state.priorities,
    isLoading: state => state.loading,
    getError: state => state.error
  }
}) 