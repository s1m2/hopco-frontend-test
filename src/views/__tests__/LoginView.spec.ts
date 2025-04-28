import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LoginView from '@/views/LoginView.vue'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

vi.mock('primevue/inputtext', () => ({
  default: {
    name: 'InputText',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: `<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`
  }
}))

vi.mock('primevue/password', () => ({
  default: {
    name: 'Password',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: `<input type="password" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`
  }
}))

vi.mock('primevue/message', () => ({
  default: {
    name: 'Message',
    template: `<div><slot /></div>`
  }
}))

vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    emits: ['click'],
    template: `<button @click="$emit('click')"><slot /></button>`
  }
}))

describe('LoginView', () => {
  let loginMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    loginMock = vi.fn()
  })

  function mountComponent() {
    return mount(LoginView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: () => loginMock,
            stubActions: false,
            initialState: {
              auth: {}
            },
            stores: {
              useAuthStore: () => ({
                login: loginMock
              })
            }
          })
        ]
      }
    })
  }

  it('renders welcome messages and input fields', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Welcome Back')
    expect(wrapper.text()).toContain('Please login to access account')
    expect(wrapper.find('label[for="username"]').exists()).toBe(true)
    expect(wrapper.findAll('input').length).toBe(2)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('updates username and password via v-model', async () => {
    const wrapper = mountComponent()
    const [usernameInput, passwordInput] = wrapper.findAll('input')

    await usernameInput.setValue('testuser')
    await passwordInput.setValue('secret')

    // Access component refs via wrapper.vm
    expect(wrapper.vm.username).toBe('testuser')
    expect(wrapper.vm.password).toBe('secret')
  })

  it('calls login with username and password on button click', async () => {
    const wrapper = mountComponent()
    const [usernameInput, passwordInput] = wrapper.findAll('input')
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('secret')

    await wrapper.find('button').trigger('click')

    expect(loginMock).toHaveBeenCalledWith('testuser', 'secret')
  })
})
