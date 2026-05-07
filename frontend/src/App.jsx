import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { store, persistor } from './store';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { LoadingSpinner } from './components/common';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductsPage from './pages/AdminProductsPage';

import './styles/global.css';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner fullScreen />} persistor={persistor}>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/products/new" element={<AdminProductsPage openAdd />} />
                <Route
                  path="*"
                  element={
                    <div className="not-found">
                      <h1>404</h1>
                      <p>Page not found</p>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
