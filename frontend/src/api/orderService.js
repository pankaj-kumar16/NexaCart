
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/orders'

// Place order
export const placeOrder = async (orderData, token) => {
  const response = await axios.post(API_URL, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

// Create Razorpay order
export const createPaymentOrder = async (orderId, token) => {
  const response = await axios.post(
    `${API_URL}/${orderId}/payment/create`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// Verify Razorpay payment
export const verifyPayment = async (orderId, paymentData, token) => {
  const response = await axios.post(
    `${API_URL}/${orderId}/payment/verify`,
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// Handle payment failure
export const handlePaymentFailure = async (orderId, paymentId, token) => {
  const response = await axios.post(
    `${API_URL}/${orderId}/payment/failure`,
    { razorpay_payment_id: paymentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

export const getMyOrders = async (token) => {
  const response = await axios.get(`${API_URL}/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
export const cancelOrder = async (orderId, token) => {
  const response = await axios.put(
    `${API_URL}/${orderId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}