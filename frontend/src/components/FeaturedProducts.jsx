import { useEffect, useState } from 'react'
import { Star, ShoppingCart, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../api/productService'
import { addToCart } from '../api/cartService'
import { getToken } from '../api/authService'
import productImages from '../data/productImages'


function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartMessage, setCartMessage] = useState('')
  const [cartError, setCartError] = useState('')
  const [addingProductId, setAddingProductId] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data.products || [])
      } catch (err) {
        setError(
          err.response?.data?.message || 'Unable to load products.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (product) => {
    setCartMessage('')
    setCartError('')

    const token = getToken()

    // Check whether user is logged in
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setAddingProductId(product._id)

      await addToCart(product._id, 1, token)

      setCartMessage(`${product.name} added to cart successfully!`)
    } catch (err) {
      setCartError(
        err.response?.data?.message || 'Unable to add product to cart.'
      )
    } finally {
      setAddingProductId(null)
    }
  }

  return (
    <section className="featured-section">
      <div className="featured-header">
        <div>
          <span className="section-label">OUR COLLECTION</span>
          <h2>Featured Products</h2>
          <p>Discover products from our store.</p>
        </div>
      </div>

      {cartMessage && (
        <div className="products-message success-message">
          {cartMessage}
        </div>
      )}

      {cartError && (
        <div className="products-message error-message">
          {cartError}
        </div>
      )}

      {loading && (
        <div className="products-message">
          Loading products...
        </div>
      )}

      {error && (
        <div className="products-message error-message">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="products-message">
          No products available.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-image-wrapper">
                <div className="product-image-placeholder">
                  <Package size={55} />
                  <span>{product.category}</span>
                </div>

                {product.image && (
  <img
    src={product.image}
    alt={product.name}
    onError={(e) => {
      e.currentTarget.src =
        'https://placehold.co/600x600?text=Image+Unavailable'
    }}
  />
)}

                <span className="product-badge">
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="product-info">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <p className="product-brand">
                  Brand: {product.brand || 'N/A'}
                </p>

                <div className="product-bottom">
                  <div className="product-prices">
                    <strong>
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <button
                    className="add-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={
                      product.stock <= 0 ||
                      addingProductId === product._id
                    }
                    aria-label={`Add ${product.name} to cart`}
                    title="Add to cart"
                  >
                    {addingProductId === product._id ? (
                      '...'
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                  </button>
                </div>

                <p className="product-stock">
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Currently unavailable'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default FeaturedProducts