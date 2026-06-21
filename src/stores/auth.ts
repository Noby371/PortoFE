import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

interface Admin {
  id: number
  email: string
  name?: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const admin = ref<Admin | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('admin_token', newToken)
  }

  function clearToken() {
    token.value = null
    admin.value = null
    localStorage.removeItem('admin_token')
  }

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    const data = response.data
    setToken(data.token)
    admin.value = data.admin
    return data
  }

  async function fetchMe() {
    const response = await api.get('/auth/me')
    admin.value = response.data
    return response.data
  }

  function logout() {
    clearToken()
  }

  return {
    token,
    admin,
    isAuthenticated,
    login,
    fetchMe,
    logout,
  }
})
