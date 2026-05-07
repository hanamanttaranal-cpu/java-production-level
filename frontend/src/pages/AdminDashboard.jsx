import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/axios';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div style={{
    background: '#fff', borderRadius: 12, padding: '22px 24px',
    border: '1px solid #e5e7eb', borderTop: `4px solid ${color}`,
    display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  }}>
    <div style={{ fontSize: 36 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 2 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{subtitle}</div>}
    </div>
  </div>
);

const QuickAction = ({ icon, label, to, color }) => (
  <Link to={to} style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    padding: '28px 16px', background: '#fff', border: '2px solid #e5e7eb',
    borderRadius: 12, fontWeight: 700, fontSize: 14, color: '#374151',
    textDecoration: 'none', transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  }}>
    <span style={{ fontSize: 36 }}>{icon}</span>
    {label}
  </Link>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') { navigate('/'); return; }
    api.get('/admin/dashboard')
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const now = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#111827', margin: 0 }}>⚙️ Admin Dashboard</h1>
            <p style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>Welcome back, <strong>{user?.firstName}</strong> · {now}</p>
          </div>
          <Link to="/products" target="_blank" style={{ background: '#eff6ff', color: '#2563eb', border: '2px solid #bfdbfe', borderRadius: 9, padding: '10px 18px', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            🛍️ View Store →
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 16 }}>⏳ Loading dashboard...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 40 }}>
          <StatCard title="Total Users"    value={stats?.totalUsers ?? '—'}                                  icon="👥" color="#2563eb" subtitle="Registered accounts" />
          <StatCard title="Total Products" value={stats?.totalProducts ?? '—'}                               icon="📦" color="#7c3aed" subtitle="In catalog" />
          <StatCard title="Total Orders"   value={stats?.totalOrders ?? '—'}                                 icon="🛒" color="#f59e0b" subtitle="All time" />
          <StatCard title="Revenue (30d)"  value={`₹${Number(stats?.recentRevenue ?? 0).toLocaleString()}`}  icon="💰" color="#10b981" subtitle="Last 30 days" />
          <StatCard title="Orders (30d)"   value={stats?.recentOrders ?? '—'}                                icon="📈" color="#06b6d4" subtitle="Recent activity" />
          <StatCard title="Low Stock"      value={stats?.lowStockProducts ?? '—'}                            icon="⚠️" color="#ef4444" subtitle="Under 10 units" />
        </div>
      )}

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <QuickAction icon="➕" label="Add Product"     to="/admin/products/new" color="#2563eb" />
          <QuickAction icon="📦" label="Manage Products" to="/admin/products"     color="#7c3aed" />
          <QuickAction icon="📋" label="View Orders"     to="/admin/orders"       color="#f59e0b" />
          <QuickAction icon="👥" label="Manage Users"    to="/admin/users"        color="#10b981" />
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)', border: '1px solid #bfdbfe', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 32 }}>💡</span>
        <div>
          <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: 4 }}>Product Workflow</div>
          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
            New products start as <strong>INACTIVE</strong>. Go to{' '}
            <Link to="/admin/products" style={{ color: '#2563eb', fontWeight: 700 }}>Manage Products</Link>{' '}
            to approve (✅), deactivate (⏸️), discontinue (🚫) or delete (🗑️) products anytime.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
