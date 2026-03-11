import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

const apiAuth = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
})

// Simple auth utility - handles both API calls and basic logic
export const authUtils = {
  // Login user
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await apiAuth.post('/auth/login', credentials)
      console.log("Login response: ", response);
      localStorage.setItem('token', response.data.token)
      return { success: true, data: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    }
  },

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('token')
      await apiAuth.post('/auth/logout', {}, {
        headers: { authorization: `Bearer ${token}` }
      })
      localStorage.removeItem('token')
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Logout failed' }
    }
  },

  // Check if user is authenticated
  async checkAuth() {
    
    try {
      const token = localStorage.getItem('token')
      if (!token) return { success: false, user: null }
      const response = await apiAuth.get('/auth/me', {
        headers: { authorization: `Bearer ${token}` }
      })

      console.log("Inside checkauth: ", response.data);
      
      return { success: true, user: response.data.data }
    } catch (error) {
      return { success: false, user: null }
    }
  },

  // Register user
  async register(userData: object) {
    try {
      const response = await apiAuth.post('/auth/register', userData)
      return { success: true, data: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      }
    }
  }
}