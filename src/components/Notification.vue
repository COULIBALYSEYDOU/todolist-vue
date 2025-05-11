<template>
  <transition name="fade">
    <div v-if="show" :class="['notification', type]">
      {{ message }}
      <button v-if="dismissible" @click="close" class="close-btn">&times;</button>
    </div>
  </transition>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    },
    dismissible: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const show = ref(true)

    const close = () => {
      show.value = false
    }

    watch(() => props.message, () => {
      show.value = true
      if (props.duration > 0) {
        setTimeout(close, props.duration)
      }
    })

    return {
      show,
      close
    }
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.success {
  background-color: #4CAF50;
}

.error {
  background-color: #f44336;
}

.warning {
  background-color: #ff9800;
}

.info {
  background-color: #2196F3;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
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