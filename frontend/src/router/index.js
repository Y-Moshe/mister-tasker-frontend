import { createRouter, createWebHashHistory } from 'vue-router'

import taskIndexView from '../views/task-index.vue'
import taskEditView from '../views/task-edit.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/task',
    },
    {
      path: '/task',
      name: 'task',
      component: taskIndexView,
    },
    {
      path: '/task/edit/:id?',
      name: 'task-edit',
      component: taskEditView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/task'
    }
  ],
})
