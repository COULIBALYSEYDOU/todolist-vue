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

export default createStore({
  modules: {
    notifications
  },
  state: {
    tasks: loadTasks(),
    loading: false,
    error: null
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
    }
  },
  actions: {
    async addTask({ commit, dispatch }, task) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('ADD_TASK', { ...task, id: Date.now() })
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
        commit('UPDATE_TASK', task)
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
    }
  },
  getters: {
    getAllTasks: state => state.tasks,
    isLoading: state => state.loading,
    getError: state => state.error
  }
}) 