import { createRouter, createWebHashHistory } from 'vue-router'
import taskView from '../views/task-view.vue'
import taskEdit from '../views/task-edit.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/task'
    },
    {
      path: '/task',
      name: 'task',
      component: taskView
    },
    {
      path: '/task/edit/:id?',
      name: 'task-edit',
      component: taskEdit
    }
  ]
})

export default router
