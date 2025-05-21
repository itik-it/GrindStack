import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./Sidebar.css";
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../assets/SIDEBAR-LOGO.png';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="sidebar-main">
      <div className="sidebar">
        <img src={Logo} alt="Logo" className="logo" />
        <ul>
          <li><a href="Dashboard"><HomeIcon/>HOME</a></li>
          <li><a href="PointOfSales"><ShoppingCartIcon/>POINT OF SALES</a></li>
          <li><a href="Products"><LocalOfferIcon/>PRODUCTS</a></li>
          <li><a href="Inventory"><InventoryIcon/>INVENTORY</a></li>
          <li><a href="PriceCheck"><PriceCheckIcon/>PRICE CHECK</a></li>
          <li><a href="SalesReport"><AssessmentIcon/>SALES REPORT</a></li>
          <li className="logout-item"><a href="#" onClick={handleLogout}><LogoutIcon/>LOGOUT</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar
