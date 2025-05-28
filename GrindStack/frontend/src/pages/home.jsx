import React, { useState, useEffect } from 'react';
import './home.css';
import Navbar from './navbar';
import GrindStackHero from '../assets/Grindstack-hero.png';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_PRODUCT_API;
const CART_API = import.meta.env.VITE_CART_API;  // Add this to use the cart API

function Home() {
  const [activeCategory, setActiveCategory] = useState("hot");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products based on active category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!baseUrl) {
          console.error("❌ VITE_PRODUCT_API is not defined in .env");
          return;
        }

        const endpoint =
          activeCategory === "all"
            ? `${baseUrl}/products`
            : `${baseUrl}/products/category/${activeCategory}`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, baseUrl]);

  //For Add to cart function tang ina
  const handleAddToCart = async (item) => {
  try {
    const userId = sessionStorage.getItem('userId'); // Get userId from sessionStorage
    if (!userId) {
      alert('Please log in first!');
      return;
    }

    // Send the API request to add the item to the cart
    // eslint-disable-next-line no-unused-vars
    const response = await axios.post(`${CART_API}/cart/${userId}/add`, {
      productId: item._id, // Assuming item._id is the product ID
      quantity: 1, // You can dynamically change this based on user input
    });

    alert('Item added to cart!');
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add to cart');
  }
};

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
                <p>
                  Crafted with passion, served with purpose — our artisan coffee <br />
                  is designed for professionals who never compromise on quality.
                </p>
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
                {["hot", "cold", "specialty", "pastries", "all"].map(cat => (
                  <button
                    key={cat}
                    className={`category-btn ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
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
                        image={item.images && item.images.length > 0
                          ? item.images[0].startsWith('data:') 
                            ? item.images[0]
                            : `data:image/jpeg;base64,${item.images[0]}`
                          : 'https://via.placeholder.com/180x180?text=No+Image'}
                        alt={item.name}
                        className="menu-card-img"
                      />
                      <CardContent className="menu-card-content">
                        <Typography variant="h5" className="menu-item-title">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="menu-item-desc">
                          {item.description}
                        </Typography>
                        <div className="menu-card-footer">
                          <Typography variant="h6" className="price-tag-menu">
                            ₱{item.price.toFixed(2)}
                          </Typography>
                          <Button variant="contained" className="order-btn" onClick={() => handleAddToCart(item)}>
                            Add to Cart
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
