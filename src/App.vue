<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/add-task" class="nav-link">Ajouter une tâche</router-link>
    </nav>
    
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div v-if="error" class="error-banner">
      {{ error }}
      <button @click="clearError" class="close-btn">&times;</button>
    </div>
    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <Notification
      v-for="notification in notifications"
      :key="notification.id"
      :message="notification.message"
      :type="notification.type"
      :duration="notification.duration"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Notification from './components/Notification.vue'

export default {
  name: 'App',
  components: {
    Notification
  },
  setup() {
    const store = useStore()
    
    const isLoading = computed(() => store.getters.isLoading)
    const error = computed(() => store.getters.getError)
    const notifications = computed(() => store.state.notifications.notifications)

    const clearError = () => {
      store.commit('SET_ERROR', null)
    }

    return {
      isLoading,
      error,
      notifications,
      clearError
    }
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background-color: #2c3e50;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #34495e;
}

.router-link-active {
  background-color: #34495e;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-banner {
  background-color: #f44336;
  color: white;
  padding: 1rem;
  margin: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
