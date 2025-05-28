import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ManageProd from './pages/manageprod';
import CartPage from './pages/CartPage.jsx';
import Home from './pages/home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          setIsAuthenticated(true);
          return;
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    sessionStorage.clear();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();  
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<LoginPage onLogin={checkAuth} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/manageprod" element={<ManageProd />} />
          <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
