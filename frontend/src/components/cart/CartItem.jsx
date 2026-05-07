import React from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) return;
    try {
      await dispatch(updateCartItem({ itemId: item.id, quantity: newQty })).unwrap();
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await dispatch(removeFromCart(item.id)).unwrap();
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="cart-item">
      <img src={item.productImage || 'https://via.placeholder.com/80'} alt={item.productName} />
      <div className="cart-item-info">
        <h4>{item.productName}</h4>
        <p className="cart-item-price">₹{item.price?.toLocaleString()}</p>
      </div>
      <div className="cart-item-qty">
        <button onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}><FiMinus /></button>
        <span>{item.quantity}</span>
        <button onClick={() => handleQuantityChange(item.quantity + 1)}><FiPlus /></button>
      </div>
      <div className="cart-item-total">₹{item.totalPrice?.toLocaleString()}</div>
      <button className="remove-btn" onClick={handleRemove}><FiTrash2 /></button>
    </div>
  );
};

export default CartItemCard;
