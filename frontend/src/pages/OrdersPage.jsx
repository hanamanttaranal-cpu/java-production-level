import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { LoadingSpinner } from '../components/common';
import toast from 'react-hot-toast';

const statusColors = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444', RETURNED: '#6b7280'
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data.data?.content || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  if (orders.length === 0) return (
    <div className="empty-state">
      <span style={{ fontSize: '4rem' }}>📦</span>
      <h2>No orders yet</h2>
      <p>When you place an order, it will appear here.</p>
      <Link to="/products" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-number">{order.orderNumber}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="order-status" style={{ backgroundColor: statusColors[order.status] }}>
                {order.status}
              </span>
            </div>
            <div className="order-items-preview">
              {order.items?.slice(0, 3).map(item => (
                <div key={item.id} className="order-item-row">
                  <span>{item.productName}</span>
                  <span>x{item.quantity}</span>
                  <span>₹{item.totalPrice?.toLocaleString()}</span>
                </div>
              ))}
              {order.items?.length > 3 && <p>+{order.items.length - 3} more items</p>}
            </div>
            <div className="order-footer">
              <span className="order-total">Total: ₹{Number(order.totalAmount).toLocaleString()}</span>
              <Link to={`/orders/${order.id}`} className="btn-outline btn-sm">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
