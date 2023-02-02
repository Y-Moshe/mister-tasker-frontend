import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { ElButton } from 'element-plus'

import { taskService } from '../../services/task.service'
import taskActions from '../task-actions.vue'

const task = taskService.getEmptyTask()
const taskActionsWrapper = (task) => mount(taskActions, {
  props: { task },
  global: {
    components: { ElButton },
    stubs: { RouterLink: RouterLinkStub }
  }
})

describe('task-actions tests', () => {

  it('should have task prop', () => {
    const wrapper = taskActionsWrapper(task)
    expect(wrapper.props().task).toBeTruthy()
  })

  it('should emit @start event on start btn click', () => {
    task.status = 'new'
    const wrapper = taskActionsWrapper(task)

    const startBtn = wrapper.find('.start-btn')
    expect(startBtn.exists()).toBe(true)
    expect(startBtn.text()).toBe('Start')
    startBtn.trigger('click')
    expect(wrapper.emitted('start')).toBeTruthy()
  })

  it('should emit @retry event on retry btn click', () => {
    task.status = 'failed'
    const wrapper = taskActionsWrapper(task)

    const retryBtn = wrapper.find('.retry-btn')
    expect(retryBtn.exists()).toBe(true)
    expect(retryBtn.text()).toBe('Retry')
    retryBtn.trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('should emit @delete event on delete btn click', () => {
    task.status = 'done'
    const wrapper = taskActionsWrapper(task)

    const deleteBtn = wrapper.find('.delete-btn')
    expect(deleteBtn.exists()).toBe(true)
    expect(deleteBtn.text()).toBe('Delete')
    deleteBtn.trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('should hide all buttons in case of running status', () => {
    task.status = 'running'
    const wrapper = taskActionsWrapper(task)

    expect(wrapper.find('.start-btn').exists()).not.toBe(true)
    expect(wrapper.find('.retry-btn').exists()).not.toBe(true)
    expect(wrapper.find('.update-link').exists()).not.toBe(true)
    expect(wrapper.find('.delete-btn').exists()).not.toBe(true)
  })
})
