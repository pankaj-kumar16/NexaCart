
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

// Register new user
export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
  })

  return response.data
}

// Login user
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  })

  // Save JWT token
  localStorage.setItem('token', response.data.token)

  // Save user information
  localStorage.setItem('user', JSON.stringify(response.data.user))

  return response.data
}

// Get saved token
export const getToken = () => {
  return localStorage.getItem('token')
}

// Get logged-in user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
