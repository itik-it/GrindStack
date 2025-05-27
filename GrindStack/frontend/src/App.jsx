import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
// import BuyerDashboard from './pages/BuyerDashboard.jsx';
// import SellerDashboard from './pages/SellerDashboard.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const storedRole = sessionStorage.getItem('role');

    if (token && storedRole) {
      setUserRole(storedRole);
      setIsAuthenticated(true);
    } else {
      setUserRole('');
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userRole.toLowerCase()}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Example protected dashboards
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} /> */}
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
