import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured } from '../store/productSlice';
import ProductCard from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/common';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featured, isLoading } = useSelector(state => state.products);

  useEffect(() => { dispatch(fetchFeatured()); }, [dispatch]);

  const categories = [
    { name: 'Electronics', icon: '📱', slug: 'electronics' },
    { name: 'Fashion', icon: '👗', slug: 'fashion' },
    { name: 'Home & Garden', icon: '🏠', slug: 'home' },
    { name: 'Sports', icon: '⚽', slug: 'sports' },
    { name: 'Books', icon: '📚', slug: 'books' },
    { name: 'Beauty', icon: '💄', slug: 'beauty' },
  ];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Amazing Products</h1>
          <p>Shop the latest trends with unbeatable prices and fast delivery.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary btn-lg">Shop Now</Link>
            <Link to="/products?featured=true" className="btn-outline btn-lg">Featured Items</Link>
          </div>
        </div>
        <div className="hero-badge">
          <span>🔥 Up to 70% Off</span>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="stat"><span>🚚</span><div><strong>Free Shipping</strong><p>On orders over ₹500</p></div></div>
        <div className="stat"><span>🔒</span><div><strong>Secure Payment</strong><p>100% Safe Transactions</p></div></div>
        <div className="stat"><span>↩️</span><div><strong>Easy Returns</strong><p>30-Day Return Policy</p></div></div>
        <div className="stat"><span>🎧</span><div><strong>24/7 Support</strong><p>Always Here to Help</p></div></div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/products" className="see-all">See All →</Link>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="category-card">
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="see-all">See All →</Link>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div>
          <h2>Special Offer</h2>
          <p>Get 20% off on your first order using code: <strong>FIRST20</strong></p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
