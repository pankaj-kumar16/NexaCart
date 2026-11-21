
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react'

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">
          <Sparkles size={16} />
          Your everyday shopping destination
        </span>

        <h1>
          Everything you need,
          <span> all in one place.</span>
        </h1>

        <p>
          Discover amazing products, great prices and a shopping
          experience made simple.
        </p>

        <button className="hero-button">
          Shop Now
          <ArrowRight size={18} />
        </button>

        <div className="hero-stats">
          <div>
            <strong>Quality</strong>
            <span>Products</span>
          </div>

          <div>
            <strong>Secure</strong>
            <span>Payments</span>
          </div>

          <div>
            <strong>Fast</strong>
            <span>Shopping</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-circle">
          <div className="hero-shopping-card">
            <ShoppingBag size={100} strokeWidth={1.3} />

            <span className="floating-tag">
              Shop smarter.
            </span>
          </div>
        </div>

        <div className="hero-float float-one">
          ✨ Quality products
        </div>

        <div className="hero-float float-two">
          🛍️ Happy shopping
        </div>
      </div>
    </section>
  )
}

export default Hero
