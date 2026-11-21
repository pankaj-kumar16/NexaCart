
import { useEffect, useState } from 'react'
import { Package, ShoppingBag, Truck, Clock } from 'lucide-react'
import { getMyOrders, cancelOrder } from '../api/orderService'
import { getToken } from '../api/authService'
import OrderTracking from '../components/OrderTracking'


function MyOrders() {
const [cancelConfirmId, setCancelConfirmId] = useState(null)
const [cancellingOrderId, setCancellingOrderId] = useState(null)
const [cancelMessage, setCancelMessage] = useState('')
const [cancelError, setCancelError] = useState('')
const [orders, setOrders] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken()
        const response = await getMyOrders(token)

        setOrders(response.orders || [])
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch orders.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])
   const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId)
      setCancelError('')
      setCancelMessage('')

      const token = getToken()
      const response = await cancelOrder(orderId, token)

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? response.order : order
        )
      )

      setCancelConfirmId(null)
      setCancelMessage('Order cancelled successfully!')
    } catch (error) {
      setCancelError(
        error.response?.data?.message || 'Failed to cancel order'
      )
    } finally {
      setCancellingOrderId(null)
    }
  }

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="orders-loading">
          <Package size={35} />
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-orders-page">
        <div className="orders-error">
          <h2>Unable to load orders</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">

        <div className="my-orders-header">
          <div>
            <h1>My Orders</h1>
            <p>Track and manage your purchases.</p>
          </div>

          <div className="orders-count">
            <ShoppingBag size={20} />
            <span>{orders.length} Orders</span>
          </div>
        </div>
        {cancelMessage && (
  <div className="cancel-success-message">
    {cancelMessage}
  </div>
)}

{cancelError && (
  <div className="cancel-error-message">
    {cancelError}
  </div>
)}

        {orders.length === 0 ? (
          <div className="empty-orders">
            <ShoppingBag size={55} />
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => (
              <div className="order-card" key={order._id}>

                <div className="order-card-header">
                  <div>
                    <span className="order-label">Order ID</span>
                    <strong>{order._id}</strong>
                  </div>

                  <div className="order-status">
                    <Package size={16} />
                    <span>{order.orderStatus}</span>
                  </div>
                </div>

                <div className="order-date">
                  <Clock size={16} />
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>

                <div className="order-products">
                  {order.items?.map((item, index) => (
                    <div
                      className="order-product"
                      key={item.productId || index}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="order-product-details">
                        <h3>{item.name}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <strong>
                          ₹{Number(item.price).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

<OrderTracking orderStatus={order.orderStatus} />

                <div className="order-card-footer">
                  <div className="order-payment-info">
                    <span>Payment</span>
                    <strong>{order.paymentMethod}</strong>
                    <small>{order.paymentStatus}</small>
                  </div>

                  <div className="order-total">
                    <span>Total Amount</span>
                    <strong>
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
                
                <div className="order-cancel-section">

  {['PLACED', 'CONFIRMED'].includes(order.orderStatus) && (
    <>
      {cancelConfirmId === order._id ? (
        <div className="cancel-confirm-box">
          <p>Are you sure you want to cancel this order?</p>

          <button
            className="confirm-cancel-btn"
            onClick={() => handleCancelOrder(order._id)}
            disabled={cancellingOrderId === order._id}
          >
            {cancellingOrderId === order._id
              ? 'Cancelling...'
              : 'Yes, Cancel Order'}
          </button>

          <button
            className="keep-order-btn"
            onClick={() => setCancelConfirmId(null)}
            disabled={cancellingOrderId === order._id}
          >
            Keep Order
          </button>
        </div>
      ) : (
        <button
          className="cancel-order-btn"
          onClick={() => {
            setCancelMessage('')
            setCancelError('')
            setCancelConfirmId(order._id)
          }}
        >
          Cancel Order
        </button>
      )}
    </>
  )}

</div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default MyOrders
