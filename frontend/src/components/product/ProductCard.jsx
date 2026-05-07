import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { StarRating } from '../common';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const primaryImage = product.imageUrls?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-image-wrapper">
          <img src={primaryImage} alt={product.name} className="product-image" />
          {discountPercent && <span className="discount-badge">-{discountPercent}%</span>}
          {product.stockQuantity === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
          <button className="wishlist-btn" onClick={(e) => e.preventDefault()}>
            <FiHeart />
          </button>
        </div>

        <div className="product-info">
          <p className="product-brand">{product.brand}</p>
          <h3 className="product-name">{product.name}</h3>

          <StarRating rating={product.averageRating} reviews={product.totalReviews} />

          <div className="product-price">
            <span className="price-current">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="price-original">₹{product.price.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>

      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.stockQuantity === 0}>
        <FiShoppingCart />
        {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
