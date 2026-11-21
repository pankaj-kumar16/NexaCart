
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Package, ShoppingBag, ArrowRight } from 'lucide-react'

function OrderSuccess() {
  const location = useLocation()
  const navigate = useNavigate()

  const orderId = location.state?.orderId
  const totalAmount = location.state?.totalAmount
  const paymentMethod = location.state?.paymentMethod || 'COD'
  const paymentStatus = location.state?.paymentStatus || 'PENDING'

  const isPaid = paymentStatus === 'PAID'

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        <div className="success-icon">
          <CheckCircle size={60} />
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for shopping with NexaCart.
          Your order has been placed successfully.
        </p>

        {orderId && (
          <div className="success-order-id">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
        )}

        {totalAmount != null && (
          <div className="success-order-id">
            <span>Total Amount</span>
            <strong>
              ₹{Number(totalAmount).toLocaleString('en-IN')}
            </strong>
          </div>
        )}

        <div className="success-order-info">
          <Package size={20} />
          <div>
            <strong>Order Confirmation</strong>
            <p>
              {paymentMethod === 'COD'
                ? 'You can pay when your order arrives.'
                : isPaid
                  ? 'Your online payment has been verified successfully.'
                  : 'Your online payment is pending confirmation.'}
            </p>
          </div>
        </div>

        <div className="success-order-id">
          <span>Payment Status</span>
          <strong>{paymentMethod === 'COD' ? 'Cash on Delivery' : paymentStatus}</strong>
        </div>

        <button
          className="success-home-btn"
          onClick={() => navigate('/')}
        >
          Continue Shopping
          <ArrowRight size={18} />
        </button>

        <button
          className="success-orders-btn"
          onClick={() => navigate('/my-orders')}
        >
          <ShoppingBag size={18} />
          View My Orders
        </button>
      </div>
    </div>
  )
}

export default OrderSuccess
