import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddTask from '../views/AddTask.vue'
import EditTask from '../views/EditTask.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add-task',
    name: 'AddTask',
    component: AddTask
  },
  {
    path: '/edit-task/:id',
    name: 'EditTask',
    component: EditTask,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 