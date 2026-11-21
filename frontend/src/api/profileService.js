
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

// Fetch logged-in user's profile
export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

// Update user's name and email
export const updateProfile = async (profileData, token) => {
  const response = await axios.put(
    `${API_URL}/profile`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// Change user password
export const changePassword = async (passwordData, token) => {
  const response = await axios.put(
    `${API_URL}/change-password`,
    passwordData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// Delete user account
export const deleteAccount = async (password, token) => {
  const response = await axios.delete(
    `${API_URL}/delete-account`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { password },
    }
  )

  return response.data
}
