import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

const ProductFilter = ({ onFilter }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ categoryId: '', minPrice: '', maxPrice: '', sortBy: 'createdAt', sortDir: 'desc' });

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    onFilter(updated);
  };

  const handleReset = () => {
    const reset = { categoryId: '', minPrice: '', maxPrice: '', sortBy: 'createdAt', sortDir: 'desc' };
    setFilters(reset);
    onFilter(reset);
  };

  return (
    <div className="product-filter">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Category</label>
        <select name="categoryId" value={filters.categoryId} onChange={handleChange}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <div className="price-range">
          <input type="number" name="minPrice" placeholder="Min ₹" value={filters.minPrice} onChange={handleChange} />
          <span>—</span>
          <input type="number" name="maxPrice" placeholder="Max ₹" value={filters.maxPrice} onChange={handleChange} />
        </div>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
          <option value="createdAt">Newest First</option>
          <option value="price">Price</option>
          <option value="averageRating">Rating</option>
          <option value="name">Name (A-Z)</option>
        </select>
        <select name="sortDir" value={filters.sortDir} onChange={handleChange}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <button className="btn-outline reset-btn" onClick={handleReset}>Reset Filters</button>
    </div>
  );
};

export default ProductFilter;
