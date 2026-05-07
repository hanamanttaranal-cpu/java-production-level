import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/cartSlice';
import CartItemCard from '../components/cart/CartItem';
import { LoadingSpinner } from '../components/common';
import { FiShoppingBag } from 'react-icons/fi';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalItems, isLoading } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) return (
    <div className="empty-state">
      <FiShoppingBag size={64} />
      <h2>Please login to view your cart</h2>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  );

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (items.length === 0) return (
    <div className="empty-state">
      <FiShoppingBag size={64} />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn-primary">Start Shopping</Link>
    </div>
  );

  const shipping = totalAmount >= 500 ? 0 : 50;
  const tax = totalAmount * 0.18;
  const grandTotal = totalAmount + shipping + tax;

  return (
    <div className="cart-page">
      <h1>Shopping Cart ({totalItems} items)</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => <CartItemCard key={item.id} item={item} />)}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{Number(totalAmount).toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          <div className="summary-row"><span>Tax (18%)</span><span>₹{tax.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
          {totalAmount < 500 && <p className="free-ship-note">Add ₹{(500 - totalAmount).toFixed(2)} more for FREE shipping!</p>}
          <button className="btn-primary btn-full" onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
