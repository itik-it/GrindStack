import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './Navbar.css';
import Logo from '../assets/GRINDSTACK-LOGONottle.png'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-section">
          <img src={Logo} alt="Grind Stack Logo" className="logo-img" />
          <span className="brand-name">GRIND STACK</span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/menu">MENU</Link></li>
        </ul>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Cart">
            <ShoppingCartIcon style={{ fontSize: '1.6rem' }} />
          </button>
          <Link to="/manageprod" className="reservation-btn">
            Manage Products
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
