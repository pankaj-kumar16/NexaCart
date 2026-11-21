
import { useEffect, useState } from 'react'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { getCart, updateCartQuantity, removeFromCart } from '../api/cartService'
import { getToken } from '../api/authService'
import { useNavigate } from 'react-router-dom'
function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const token = getToken()
  const navigate = useNavigate()
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) {
          setError('Please login to view your cart.')
          return
        }

        const data = await getCart(token)
        setCart(data.cart?.items || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load cart.')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const handleQuantityChange = async (item, newQuantity) => {
    setError('')

    try {
      setUpdatingId(item.productId)

      if (newQuantity < 1) {
        await removeFromCart(item.productId, token)

        setCart((prevCart) =>
          prevCart.filter(
            (cartItem) => cartItem.productId !== item.productId
          )
        )
        return
      }

      const data = await updateCartQuantity(
        item.productId,
        newQuantity,
        token
      )

      if (data.cart?.items) {
        setCart(data.cart.items)
      } else {
        setCart((prevCart) =>
          prevCart.map((cartItem) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          )
        )
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to update quantity.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemove = async (productId) => {
    setError('')

    try {
      setUpdatingId(productId)

      await removeFromCart(productId, token)

      setCart((prevCart) =>
        prevCart.filter((item) => item.productId !== productId)
      )
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to remove product.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="cart-page">
        <p className="cart-loading">Loading your cart...</p>
      </div>
    )
  }

  if (error && cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>My Shopping Cart</h1>
        <p className="cart-error">{error}</p>
      </div>
    )
  }

  return (
    <section className="cart-page">
      <div className="cart-heading">
        <div>
          <span className="cart-label">YOUR BAG</span>
          <h1>Shopping Cart</h1>
          <p>{totalItems} items in your cart</p>
        </div>
        <ShoppingBag size={30} className="cart-heading-icon" />
      </div>

      {error && <p className="cart-error">{error}</p>}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <ShoppingBag size={55} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-products">
            {cart.map((item) => (
              <article className="cart-product-card" key={item.productId}>
                <div className="cart-product-image">
                  <img
                    src={
                      item.image ||
                      'https://placehold.co/400x400?text=Product'
                    }
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://placehold.co/400x400?text=Product'
                    }}
                  />
                </div>

                <div className="cart-product-details">
                  <div className="cart-product-top">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="cart-product-price">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      className="cart-remove-icon"
                      onClick={() => handleRemove(item.productId)}
                      disabled={updatingId === item.productId}
                      title="Remove product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="cart-product-bottom">
                    <div className="cart-quantity">
                      <button
                        onClick={() =>
                          handleQuantityChange(item, item.quantity - 1)
                        }
                        disabled={updatingId === item.productId}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          handleQuantityChange(item, item.quantity + 1)
                        }
                        disabled={updatingId === item.productId}
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <strong className="cart-item-subtotal">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items ({totalItems})</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>

            <div className="summary-row">
              <span>Taxes</span>
              <span>Included</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total Amount</span>
              <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
            </div>

            <button
  className="checkout-btn"
  onClick={() =>
  navigate('/checkout', {
    state: {
      totalAmount,
      totalItems,
    },
  })
}
>
  Proceed to Checkout
  <ArrowRight size={18} />
</button>

            <p className="cart-secure-note">
              Secure checkout · Easy payments
            </p>
          </aside>
        </div>
      )}
    </section>
  )
}

export default Cart
