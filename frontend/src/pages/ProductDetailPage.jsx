import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { StarRating, LoadingSpinner } from '../components/common';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, isLoading } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => { dispatch(fetchProductById(id)); }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/login'); return; }
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!product) return <div className="error-page">Product not found</div>;

  const images = product.imageUrls?.length > 0 ? product.imageUrls : ['https://via.placeholder.com/500x500?text=No+Image'];
  const finalPrice = product.discountPrice || product.price;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : null;

  return (
    <div className="product-detail-page">
      <div className="product-detail-layout">
        {/* Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={images[selectedImage]} alt={product.name} />
          </div>
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setSelectedImage(i)}
                  className={i === selectedImage ? 'active' : ''} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <p className="detail-brand">{product.brand}</p>
          <h1>{product.name}</h1>
          <StarRating rating={product.averageRating} reviews={product.totalReviews} />

          <div className="detail-price">
            <span className="price-big">₹{Number(finalPrice).toLocaleString()}</span>
            {discount && (
              <>
                <span className="price-original-big">₹{Number(product.price).toLocaleString()}</span>
                <span className="discount-tag">{discount}% OFF</span>
              </>
            )}
          </div>

          <div className="detail-stock">
            {product.stockQuantity > 0
              ? <span className="in-stock">✅ In Stock ({product.stockQuantity} left)</span>
              : <span className="out-stock">❌ Out of Stock</span>}
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="qty-controls">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}>+</button>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn-primary btn-lg" onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}>
              <FiShoppingCart /> Add to Cart
            </button>
            <button className="btn-outline"><FiHeart /></button>
            <button className="btn-outline"><FiShare2 /></button>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.tags?.length > 0 && (
            <div className="product-tags">
              {product.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
