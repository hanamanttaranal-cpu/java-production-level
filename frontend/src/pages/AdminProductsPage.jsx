import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/axios';
import toast from 'react-hot-toast';

/* ─── tiny helpers ─────────────────────────────────────────── */
const STATUS_META = {
  ACTIVE:       { label: 'Active',        bg: '#dcfce7', color: '#16a34a' },
  INACTIVE:     { label: 'Inactive',      bg: '#f3f4f6', color: '#6b7280' },
  OUT_OF_STOCK: { label: 'Out of Stock',  bg: '#fef9c3', color: '#ca8a04' },
  DISCONTINUED: { label: 'Discontinued',  bg: '#fee2e2', color: '#dc2626' },
};

const EMPTY_FORM = {
  name: '', description: '', price: '', discountPrice: '',
  stockQuantity: '', categoryId: '', brand: '', sku: '',
  featured: false, tags: '', weight: '', dimensions: '',
};

/* ─── Modal ─────────────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

/* ─── Confirm Dialog ─────────────────────────────────────────── */
function ConfirmDialog({ message, onConfirm, onCancel, danger }) {
  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, maxWidth: 400 }}>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{danger ? '🗑️' : '⚠️'}</div>
          <p style={{ fontSize: 16, color: '#374151', marginBottom: 28, lineHeight: 1.6 }}>{message}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button style={styles.btnGhost} onClick={onCancel}>Cancel</button>
            <button style={danger ? styles.btnDanger : styles.btnPrimary} onClick={onConfirm}>
              {danger ? '🗑️ Delete' : '✅ Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Form ───────────────────────────────────────────── */
function ProductForm({ initial, categories, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
      stockQuantity: parseInt(form.stockQuantity),
      categoryId: parseInt(form.categoryId),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      weight: form.weight ? parseFloat(form.weight) : null,
    });
  };

  const F = ({ label, name, type = 'text', placeholder, required, half }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label style={styles.label}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
      <input name={name} type={type} value={form[name]} onChange={set}
        required={required} placeholder={placeholder}
        style={styles.input} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={styles.label}>Product Name <span style={{ color: '#ef4444' }}>*</span></label>
          <input name="name" value={form.name} onChange={set} required placeholder="e.g. iPhone 15 Pro" style={styles.input} />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={styles.label}>Description</label>
          <textarea name="description" value={form.description} onChange={set} rows={3}
            placeholder="Describe the product features, specs, etc."
            style={{ ...styles.input, resize: 'vertical', height: 90 }} />
        </div>

        <F label="Price (₹)" name="price" type="number" placeholder="99999" required half />
        <F label="Discount Price (₹)" name="discountPrice" type="number" placeholder="89999 (optional)" half />
        <F label="Stock Quantity" name="stockQuantity" type="number" placeholder="100" required half />
        <F label="SKU" name="sku" placeholder="PROD-001 (optional)" half />

        <div>
          <label style={styles.label}>Category <span style={{ color: '#ef4444' }}>*</span></label>
          <select name="categoryId" value={form.categoryId} onChange={set} required style={styles.input}>
            <option value="">-- Select Category --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <F label="Brand" name="brand" placeholder="Apple, Samsung..." half />

        <div style={{ gridColumn: 'span 2' }}>
          <label style={styles.label}>Tags <span style={{ color: '#9ca3af', fontWeight: 400 }}>(comma separated)</span></label>
          <input name="tags" value={form.tags} onChange={set}
            placeholder="smartphone, apple, 5g" style={styles.input} />
        </div>

        <F label="Weight (kg)" name="weight" type="number" placeholder="0.2" half />
        <F label="Dimensions (LxWxH cm)" name="dimensions" placeholder="15x7x0.8" half />

        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="featured" name="featured"
            checked={form.featured} onChange={set}
            style={{ width: 18, height: 18, accentColor: '#2563eb', cursor: 'pointer' }} />
          <label htmlFor="featured" style={{ ...styles.label, marginBottom: 0, cursor: 'pointer' }}>
            ⭐ Mark as Featured Product (shows on homepage)
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
        <button type="button" style={styles.btnGhost} onClick={onClose}>Cancel</button>
        <button type="submit" style={styles.btnPrimary} disabled={loading}>
          {loading ? '⏳ Saving...' : initial ? '💾 Save Changes' : '✅ Create Product'}
        </button>
      </div>
    </form>
  );
}

/* ─── Main Admin Products Page ───────────────────────────────── */
export default function AdminProductsPage({ openAdd }) {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showAddModal, setShowAddModal]   = useState(!!openAdd);
  const [editProduct, setEditProduct]     = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [approveTarget, setApproveTarget] = useState(null); // {product, newStatus}

  /* Auth guard */
  useEffect(() => {
    if (user && user.role !== 'ADMIN') navigate('/');
  }, [user, navigate]);

  /* Load categories once */
  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  /* Load products */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products/admin/all', {
        params: { page, size: 15, sortBy: 'createdAt', sortDir: 'desc' },
      });
      let items = data.data?.content || [];
      if (search)       items = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || '').toLowerCase().includes(search.toLowerCase()));
      if (statusFilter) items = items.filter(p => p.status === statusFilter);
      setProducts(items);
      setTotalPages(data.data?.totalPages || 1);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  /* Actions */
  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      await api.post('/products', payload);
      toast.success('✅ Product created!');
      setShowAddModal(false);
      loadProducts();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create product');
    } finally { setSaving(false); }
  };

  const handleEdit = async (payload) => {
    setSaving(true);
    try {
      await api.put(`/products/${editProduct.id}`, payload);
      toast.success('✅ Product updated!');
      setEditProduct(null);
      loadProducts();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update product');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      toast.success('🗑️ Product deleted');
      setDeleteTarget(null);
      loadProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleStatusChange = async () => {
    const { product, newStatus } = approveTarget;
    try {
      await api.patch(`/products/${product.id}/status?status=${newStatus}`);
      const label = newStatus === 'ACTIVE' ? '✅ Product approved & live!' : '⏸️ Product deactivated';
      toast.success(label);
      setApproveTarget(null);
      loadProducts();
    } catch {
      toast.error('Failed to update status');
    }
  };

  /* Prepare edit form initial values */
  const openEdit = (p) => {
    setEditProduct({
      ...p,
      tags: (p.tags || []).join(', '),
      categoryId: p.categoryId || '',
    });
  };

  const counts = {
    total: products.length,
    active: products.filter(p => p.status === 'ACTIVE').length,
    inactive: products.filter(p => p.status === 'INACTIVE').length,
    featured: products.filter(p => p.featured).length,
  };

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>📦 Product Management</h1>
          <p style={styles.pageSubtitle}>Add, edit, approve and delete your store products</p>
        </div>
        <button style={styles.btnPrimary} onClick={() => setShowAddModal(true)}>
          ＋ Add New Product
        </button>
      </div>

      {/* Stats bar */}
      <div style={styles.statsRow}>
        {[
          { label: 'Total Products', value: counts.total, icon: '📦', accent: '#2563eb' },
          { label: 'Active / Live',  value: counts.active, icon: '🟢', accent: '#16a34a' },
          { label: 'Inactive',       value: counts.inactive, icon: '⏸️', accent: '#9ca3af' },
          { label: 'Featured',       value: counts.featured, icon: '⭐', accent: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ ...styles.statCard, borderTop: `3px solid ${s.accent}` }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#111827' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <input
          placeholder="🔍  Search by name or brand..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          style={{ ...styles.input, flex: 1, maxWidth: 340, marginBottom: 0 }}
        />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
          style={{ ...styles.input, width: 180, marginBottom: 0 }}>
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
          <option value="DISCONTINUED">Discontinued</option>
        </select>
        <button style={styles.btnGhost} onClick={() => { setSearch(''); setStatusFilter(''); setPage(0); }}>
          ✕ Clear
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: 48 }}>📭</div>
            <p style={{ marginTop: 12, fontSize: 16 }}>No products found.</p>
            <button style={{ ...styles.btnPrimary, marginTop: 16 }} onClick={() => setShowAddModal(true)}>
              ＋ Add your first product
            </button>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const sm = STATUS_META[p.status] || STATUS_META.INACTIVE;
                const img = p.imageUrls?.[0];
                return (
                  <tr key={p.id} style={{ ...styles.tr, background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    {/* Product */}
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={styles.productThumb}>
                          {img ? <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                               : <span style={{ fontSize: 22 }}>📦</span>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                            {p.brand || '—'} {p.sku ? `· ${p.sku}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td style={styles.td}>
                      <span style={styles.chip}>{p.categoryName || '—'}</span>
                    </td>
                    {/* Price */}
                    <td style={styles.td}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>₹{Number(p.discountPrice || p.price).toLocaleString()}</div>
                      {p.discountPrice && (
                        <div style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>
                          ₹{Number(p.price).toLocaleString()}
                        </div>
                      )}
                    </td>
                    {/* Stock */}
                    <td style={styles.td}>
                      <span style={{
                        fontWeight: 700,
                        color: p.stockQuantity === 0 ? '#dc2626' : p.stockQuantity < 10 ? '#d97706' : '#16a34a'
                      }}>
                        {p.stockQuantity}
                      </span>
                      <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>units</span>
                    </td>
                    {/* Status */}
                    <td style={styles.td}>
                      <span style={{ background: sm.bg, color: sm.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        {sm.label}
                      </span>
                    </td>
                    {/* Featured */}
                    <td style={styles.td}>
                      {p.featured ? <span style={{ color: '#f59e0b', fontSize: 20 }}>⭐</span> : <span style={{ color: '#d1d5db' }}>—</span>}
                    </td>
                    {/* Actions */}
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {/* Edit */}
                        <button title="Edit" style={styles.iconBtn} onClick={() => openEdit(p)}>✏️</button>

                        {/* Approve / Deactivate toggle */}
                        {p.status === 'ACTIVE' ? (
                          <button title="Deactivate" style={{ ...styles.iconBtn, background: '#fef9c3' }}
                            onClick={() => setApproveTarget({ product: p, newStatus: 'INACTIVE' })}>⏸️</button>
                        ) : (
                          <button title="Approve / Set Active" style={{ ...styles.iconBtn, background: '#dcfce7' }}
                            onClick={() => setApproveTarget({ product: p, newStatus: 'ACTIVE' })}>✅</button>
                        )}

                        {/* Discontinue */}
                        {p.status !== 'DISCONTINUED' && (
                          <button title="Discontinue" style={{ ...styles.iconBtn, background: '#fee2e2' }}
                            onClick={() => setApproveTarget({ product: p, newStatus: 'DISCONTINUED' })}>🚫</button>
                        )}

                        {/* Delete */}
                        <button title="Delete" style={{ ...styles.iconBtn, background: '#fef2f2' }}
                          onClick={() => setDeleteTarget(p)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button style={styles.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} style={{ ...styles.pageBtn, ...(i === page ? styles.pageBtnActive : {}) }}
              onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button style={styles.pageBtn} disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>Next ›</button>
        </div>
      )}

      {/* ── Add Modal ── */}
      {showAddModal && (
        <Modal title="➕ Add New Product" onClose={() => setShowAddModal(false)}>
          <ProductForm categories={categories} onSubmit={handleCreate} onClose={() => setShowAddModal(false)} loading={saving} />
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editProduct && (
        <Modal title="✏️ Edit Product" onClose={() => setEditProduct(null)}>
          <ProductForm initial={editProduct} categories={categories} onSubmit={handleEdit} onClose={() => setEditProduct(null)} loading={saving} />
        </Modal>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <ConfirmDialog
          danger
          message={`Are you sure you want to permanently delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Status Change Confirm ── */}
      {approveTarget && (
        <ConfirmDialog
          danger={approveTarget.newStatus === 'DISCONTINUED'}
          message={
            approveTarget.newStatus === 'ACTIVE'
              ? `Approve "${approveTarget.product.name}" and make it live for customers?`
              : approveTarget.newStatus === 'DISCONTINUED'
              ? `Mark "${approveTarget.product.name}" as Discontinued? It will be hidden from customers.`
              : `Deactivate "${approveTarget.product.name}"? It will be hidden from customers.`
          }
          onConfirm={handleStatusChange}
          onCancel={() => setApproveTarget(null)}
        />
      )}
    </div>
  );
}

/* ─── Styles ────────────────────────────────────────────────── */
const styles = {
  page: { maxWidth: 1400, margin: '0 auto', padding: '32px 24px', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 },
  pageTitle: { fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 },
  pageSubtitle: { color: '#6b7280', marginTop: 4, fontSize: 14 },

  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 10, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' },

  filterBar: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', background: '#fff', padding: '14px 16px', borderRadius: 10, border: '1px solid #e5e7eb' },

  tableWrapper: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '13px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' },
  td: { padding: '14px 16px', fontSize: 14, verticalAlign: 'middle' },

  productThumb: { width: 44, height: 44, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  chip: { background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  iconBtn: { border: 'none', background: '#f3f4f6', borderRadius: 7, padding: '6px 9px', fontSize: 16, cursor: 'pointer', transition: 'transform 0.1s', lineHeight: 1 },

  pagination: { display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 },
  pageBtn: { padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 7, background: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 600, color: '#374151' },
  pageBtnActive: { background: '#2563eb', color: '#fff', borderColor: '#2563eb' },

  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal: { background: '#fff', borderRadius: 14, width: '100%', maxWidth: 680, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, background: '#fff', zIndex: 1 },
  modalTitle: { fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 },
  modalBody: { padding: '24px' },
  closeBtn: { background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 16, cursor: 'pointer', color: '#374151', fontWeight: 700 },

  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '10px 13px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#111827', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s', marginBottom: 0 },

  btnPrimary: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 9, padding: '11px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' },
  btnGhost: { background: 'transparent', color: '#6b7280', border: '2px solid #e5e7eb', borderRadius: 9, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' },
  btnDanger: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 9, padding: '11px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
};
