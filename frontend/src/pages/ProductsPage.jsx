import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, searchProducts } from '../store/productSlice';
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import { LoadingSpinner, Pagination } from '../components/common';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items, searchResults, isLoading, totalPages, currentPage } = useSelector(state => state.products);
  const [filters, setFilters] = useState({});
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    if (searchQuery) {
      dispatch(searchProducts({ name: searchQuery, ...filters }));
    } else {
      dispatch(fetchProducts({ page: currentPage, size: 12, ...filters }));
    }
  }, [dispatch, searchQuery, filters]);

  const products = searchQuery ? searchResults : items;

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    dispatch(fetchProducts({ page, size: 12, ...filters }));
  };

  return (
    <div className="products-page">
      <div className="products-layout">
        <aside className="filter-sidebar">
          <ProductFilter onFilter={handleFilter} />
        </aside>
        <main className="products-main">
          <div className="products-header">
            <h2>{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</h2>
            <span className="product-count">{products.length} products</span>
          </div>
          {isLoading ? <LoadingSpinner /> : (
            <>
              <div className="products-grid">
                {products.length > 0 ? (
                  products.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                  <div className="no-results">
                    <p>😕 No products found</p>
                    <p>Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
