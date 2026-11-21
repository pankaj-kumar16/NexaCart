
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapPin, ArrowRight, ShoppingBag } from 'lucide-react'
import { getToken } from '../api/authService'
import {
  placeOrder,
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
} from '../api/orderService'

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()

  const totalAmount = location.state?.totalAmount || 0
  const totalItems = location.state?.totalItems || 0

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const token = getToken()

    if (!token) {
      alert('Please login first.')
      navigate('/login')
      return
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Enter a valid 10-digit phone number.')
      return
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError('Enter a valid 6-digit PIN code.')
      return
    }

    try {
      setLoading(true)

      // 1. Create order in backend
      const orderResponse = await placeOrder({
        shippingAddress: formData,
        paymentMethod,
      }, token)

      const order = orderResponse.order

      // 2. COD - order is already placed
      if (paymentMethod === 'COD') {
        alert(`Order placed successfully!\nOrder ID: ${order._id}`)

        navigate('/order-success', {
  state: {
    orderId: order._id,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
  },
})
        return
      }

      // 3. Load Razorpay SDK
      const razorpayLoaded = await loadRazorpay()

      if (!razorpayLoaded) {
        throw new Error('Unable to load Razorpay. Please try again.')
      }

      // 4. Create Razorpay payment order
      const paymentOrder = await createPaymentOrder(order._id, token)

      // 5. Open Razorpay Checkout
      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'NexaCart',
        description: 'Online Shopping Payment',
        order_id: paymentOrder.razorpayOrderId,

        handler: async (paymentResponse) => {
          try {
            // 6. Verify payment on backend
            await verifyPayment(
              order._id,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              token
            )

            alert('Payment successful! Your order is confirmed.')

            navigate('/order-success', {
  state: {
    orderId: order._id,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: 'PAID',
  },
})
          } catch (paymentError) {
            setError(
              paymentError.response?.data?.message ||
              'Payment verification failed. Please contact support.'
            )
          } finally {
            setLoading(false)
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled. Your online order is still pending.')
          },
        },

        prefill: {
          name: formData.fullName,
          contact: formData.phone,
        },

        theme: {
          color: '#111827',
        },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on('payment.failed', async (response) => {
        const paymentId = response.error?.metadata?.payment_id

        if (paymentId) {
          try {
            await handlePaymentFailure(order._id, paymentId, token)
          } catch (failureError) {
            console.error('Failure update error:', failureError)
          }
        }

        setError(
          response.error?.description ||
          'Payment failed. Please try again.'
        )
        setLoading(false)
      })

      razorpay.open()

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to place your order.'
      )
      setLoading(false)
    }
  }

  return (
    <section className="checkout-page">
      <div className="checkout-header">
        <span>SECURE CHECKOUT</span>
        <h1>Delivery Details</h1>
        <p>Enter your details to complete your order.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-section-title">
            <MapPin size={20} />
            <h2>Shipping Address</h2>
          </div>

          <div className="checkout-fields">
            <div className="checkout-field">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>

            <div className="checkout-field full-width">
              <label>Full Address</label>
              <textarea
                name="address"
                placeholder="House number, street, area..."
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="checkout-field">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-field">
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-field">
              <label>PIN Code</label>
              <input
                type="text"
                name="pincode"
                placeholder="6-digit PIN code"
                value={formData.pincode}
                onChange={handleChange}
                maxLength={6}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-payment-section">
            <h2>Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives</small>
              </span>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={paymentMethod === 'ONLINE'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>
                <strong>Online Payment</strong>
                <small>Pay securely using Razorpay</small>
              </span>
            </label>
          </div>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="checkout-submit-btn"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : paymentMethod === 'COD'
                ? 'Place Order'
                : 'Pay Now'}
            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="checkout-secure-note">
            <ShoppingBag size={15} />
            Your information is used securely for order delivery.
          </p>
        </form>

        {/* Order Summary */}
        <div className="checkout-order-summary">
          <h2>Order Summary</h2>

          <div className="checkout-summary-row">
            <span>Items ({totalItems})</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span className="checkout-free-shipping">Free</span>
          </div>

          <div className="checkout-summary-row">
            <span>Taxes</span>
            <span>Included</span>
          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-summary-total">
            <span>Total Amount</span>
            <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
