import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage } from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { totalItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${searchQuery}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">🛒 ShopNow</Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input type="text" placeholder="Search products..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button type="submit"><FiSearch /></button>
        </form>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <FiShoppingCart />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-btn"><FiUser /> {user?.firstName}</button>
              <div className="user-dropdown">
                <Link to="/profile"><FiUser /> Profile</Link>
                <Link to="/orders"><FiPackage /> My Orders</Link>
                {user?.role === 'ADMIN' && <Link to="/admin">⚙️ Admin Panel</Link>}
                <button onClick={handleLogout}><FiLogOut /> Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/products" onClick={() => setMenuOpen(false)}>All Products</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({totalItems})</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
