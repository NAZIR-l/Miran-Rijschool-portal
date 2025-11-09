import { ref, computed } from 'vue'
import { api } from 'boot/axios'
import { Cookies } from 'quasar'

export function useAuth() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Check if token exists in cookies
  const hasToken = computed(() => {
    return !!Cookies.get('auth_token')
  })

  // Validate token with backend
  const validateToken = async () => {
    if (!hasToken.value) {
      return false
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.get('/auth/me')
      user.value = response.data
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data))
      
      return true
    } catch (err) {
      // Token is invalid
      error.value = err.response?.data?.message || 'Invalid token'
      user.value = null
      
      // Clear invalid token
      Cookies.remove('auth_token', { path: '/' })
      localStorage.removeItem('user')
      
      return false
    } finally {
      loading.value = false
    }
  }

  // Check if user is authenticated (has valid token)
  const isAuthenticated = computed(() => {
    return hasToken.value && user.value !== null
  })

  // Logout function
  const logout = () => {
    Cookies.remove('auth_token', { path: '/' })
    localStorage.removeItem('user')
    user.value = null
  }

  // Get stored user data from localStorage
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
        return user.value
      }
    } catch (err) {
      console.error('Error parsing stored user:', err)
    }
    return null
  }

  return {
    user,
    loading,
    error,
    hasToken,
    isAuthenticated,
    validateToken,
    logout,
    getStoredUser
  }
}

