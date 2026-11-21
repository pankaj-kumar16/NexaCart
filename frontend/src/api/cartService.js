
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/cart'

// Get user's cart
export const getCart = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

// Add product to cart
export const addToCart = async (productId, quantity = 1, token) => {
  const response = await axios.post(
    `${API_URL}/add`,
    {
      productId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// Update product quantity
export const updateCartQuantity = async (productId, quantity, token) => {
  const response = await axios.put(
    `${API_URL}/update`,
    {
      productId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// Remove product from cart
export const removeFromCart = async (productId, token) => {
  const response = await axios.delete(
    `${API_URL}/remove/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// Clear entire cart
export const clearCart = async (token) => {
  const response = await axios.delete(`${API_URL}/clear`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
