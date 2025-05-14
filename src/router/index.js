import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddTask from '../views/AddTask.vue'
import EditTask from '../views/EditTask.vue'
import Categories from '../views/Categories.vue'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/',
      name: 'home',
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
      component: EditTask
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
    }
  ]
})

export default router 