import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from './navbar';
import GrindStackHero from '../assets/GRINDSTACK-HERO.png';
// Import Material UI components
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

function Home() {
  const [activeCategory, setActiveCategory] = useState("hot");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch products from the API based on category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint = activeCategory === "all" 
          ? 'http://localhost:1337/api/products' 
          : `http://localhost:1337/api/products/category/${activeCategory}`;
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="home-container">
      <Navbar />
      <main className="main">
        <div className="main-container">
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-text">
                <h1>Fuel your day with the <span className="highlight">perfect brew</span></h1>
                <h3>Handcrafted coffee to energize your mornings and empower your hustle.</h3>
                <p>Crafted with passion, served with purpose — our artisan coffee <br />
               is designed for professionals who never compromise on quality.</p>
                <button className="cta-button">Order Now</button>
              </div>
              <div className="hero-image">
                <div className="coffee-cup">
                  <img src={GrindStackHero} alt="Coffee Cup" />
                  <div className="price-tag">₱120</div>
                </div>
                <div className="coffee-label">
                  <div className="coffee-type">Cappuccino</div>
                  <div className="coffee-rating">4.8</div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="menu-section">
            <div className="menu-container">
              <div className="menu-header">
                <h2>Our <span className="highlight">Menu</span></h2>
                <p>Discover our handcrafted coffee and signature drinks</p>
              </div>
              
              <div className="menu-categories">
                <button 
                  className={`category-btn ${activeCategory === "hot" ? "active" : ""}`}
                  onClick={() => setActiveCategory("hot")}
                >
                  Hot Coffee
                </button>
                <button 
                  className={`category-btn ${activeCategory === "cold" ? "active" : ""}`}
                  onClick={() => setActiveCategory("cold")}
                >
                  Cold Brew
                </button>
                <button 
                  className={`category-btn ${activeCategory === "specialty" ? "active" : ""}`}
                  onClick={() => setActiveCategory("specialty")}
                >
                  Specialty
                </button>
                <button 
                  className={`category-btn ${activeCategory === "pastries" ? "active" : ""}`}
                  onClick={() => setActiveCategory("pastries")}
                >
                  Pastries
                </button>
                <button 
                  className={`category-btn ${activeCategory === "all" ? "active" : ""}`}
                  onClick={() => setActiveCategory("all")}
                >
                  All Items
                </button>
              </div>
              
              {loading ? (
                <div className="loading">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="no-products">No products available in this category</div>
              ) : (
                <div className="menu-items-grid">
                  {products.map(item => (
                    <Card key={item._id} className="menu-card">
                      <CardMedia
                        component="img"
                        height="180"
                        image={item.images && item.images.length > 0 ? 
                          item.images[0].startsWith('data:') ? item.images[0] : `data:image/jpeg;base64,${item.images[0]}`
                          : 'https://via.placeholder.com/180x180?text=No+Image'}
                        alt={item.name}
                        className="menu-card-img"
                      />
                      <div className="menu-card-rating">4.8</div>
                      <CardContent className="menu-card-content">
                        <Typography variant="h5" component="div" className="menu-item-title">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="menu-item-desc">
                          {item.description}
                        </Typography>
                        <div className="menu-card-footer">
                          <Typography variant="h6" className="price-tag-menu">
                            ₱{item.price.toFixed(2)}
                          </Typography>
                          <Button variant="contained" className="order-btn">
                            Order now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
