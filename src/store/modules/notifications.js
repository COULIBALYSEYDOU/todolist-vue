export default {
  namespaced: true,
  state: {
    notifications: []
  },
  mutations: {
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push({
        id: Date.now(),
        ...notification
      })
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id)
    }
  },
  actions: {
    notify({ commit }, { message, type = 'info', duration = 3000 }) {
      const id = Date.now()
      commit('ADD_NOTIFICATION', { id, message, type, duration })
      if (duration > 0) {
        setTimeout(() => {
          commit('REMOVE_NOTIFICATION', id)
        }, duration)
      }
    },
    success({ dispatch }, message) {
      dispatch('notify', { message, type: 'success' })
    },
    error({ dispatch }, message) {
      dispatch('notify', { message, type: 'error', duration: 5000 })
    },
    warning({ dispatch }, message) {
      dispatch('notify', { message, type: 'warning' })
    }
  }
} 