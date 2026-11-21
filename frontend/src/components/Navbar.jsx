
import { Search, ShoppingCart, User, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, getToken, logoutUser } from '../api/authService'

function Navbar() {
  const user = getCurrentUser()
  const token = getToken()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
    window.location.reload()
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo-link">
          <h2 className="logo">
            Nexa<span>Cart</span>
          </h2>
        </Link>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products..."
          />
          <button>
            <Search size={20} />
          </button>
        </div>

        <div className="nav-actions">
          {token && user ? (
  <div className="account-btn">
    <User size={20} />

    <span>{user.name}</span>

    <Link to="/profile" className="profile-nav-link">
      Profile
    </Link>

    <button className="logout-btn" onClick={handleLogout}>
      <LogOut size={16} />
      Logout
    </button>
  </div>
) : (
            <Link to="/login" className="account-btn">
              <User size={20} />
              <span>Login</span>
            </Link>
          )}

          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} />
            <span>Cart</span>
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
