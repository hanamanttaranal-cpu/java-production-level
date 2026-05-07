import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <h3>🛒 ShopNow</h3>
        <p>Your one-stop shop for everything you love.</p>
        <div className="footer-social">
          <a href="#facebook">📘</a>
          <a href="#twitter">🐦</a>
          <a href="#instagram">📷</a>
        </div>
      </div>
      <div className="footer-links">
        <div>
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=electronics">Electronics</Link>
          <Link to="/products?category=fashion">Fashion</Link>
          <Link to="/products?category=home">Home & Garden</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/profile">My Profile</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div>
          <h4>Support</h4>
          <Link to="/contact">Contact Us</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/returns">Returns Policy</Link>
          <Link to="/shipping">Shipping Info</Link>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} ShopNow. All rights reserved.</p>
      <div>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
