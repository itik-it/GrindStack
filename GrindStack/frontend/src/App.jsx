// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ManageProd from './pages/manageprod';
import CartPage from './pages/CartPage.jsx';
import Order from './pages/orderservice'; 
import Home from './pages/home';
import OrderSummary from './pages/OrderSummary.jsx'; 


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkAuth = () => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          setIsAuthenticated(true);
          setCheckingAuth(false);
          return;
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    sessionStorage.clear();
    setIsAuthenticated(false);
    setCheckingAuth(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkingAuth) return <div>Loading...</div>; 

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/CartPage"
          element={isAuthenticated ? <CartPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/orderservice"
          element={isAuthenticated ? <Order /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/order-summary/:orderId"
          element={isAuthenticated ? <OrderSummary /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<LoginPage onLogin={checkAuth} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/manageprod" element={<ManageProd />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
