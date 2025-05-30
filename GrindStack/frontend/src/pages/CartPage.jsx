import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Divider, Snackbar, Alert
} from '@mui/material';
import Navbar from './navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CART_API = import.meta.env.VITE_CART_API;
const PRODUCT_API = import.meta.env.VITE_PRODUCT_API;

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const res = await axios.get(`${CART_API}/cart/${userId}`);
        const cartData = res.data;

        const productRes = await axios.get(`${PRODUCT_API}/products`);
        const allProducts = productRes.data;

        const merged = Object.entries(cartData).map(([productId, quantity]) => {
          const product = allProducts.find(p => p._id === productId);
          return {
            ...product,
            quantity: parseInt(quantity),
          };
        });

        setCartItems(merged);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    fetchCart();
  }, [userId]);

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleCheckout = async () => {
    try {
      // Verify stock availability before proceeding
      const stockCheckPromises = cartItems.map(async (item) => {
        const response = await axios.get(`${PRODUCT_API}/products/${item._id}`);
        const currentStock = response.data.stock;
        
        if (currentStock < item.quantity) {
          throw new Error(`Not enough stock for ${item.name}. Only ${currentStock} available.`);
        }
        return true;
      });
      
      await Promise.all(stockCheckPromises);
      
      // If stock check passes, proceed with checkout
      const total = getTotal();
      
      // Navigate to order summary
      navigate('/order-summary/preview', {
        state: {
          cartItems,
          total,
          userId
        }
      });
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-inner">
          <Typography variant="h4" gutterBottom>Shopping Cart</Typography>

          <div className="cart-items">
            {cartItems.length === 0 ? (
              <Typography>No items in cart.</Typography>
            ) : (
              cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-info">
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2">₱{item.price.toFixed(2)}</Typography>
                    <Typography variant="body2">Qty: {item.quantity}</Typography>
                  </div>
                </div>
              ))
            )}
          </div>

          <Divider sx={{ my: 2 }} />

          <div className="cart-summary">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Total: ₱{getTotal().toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={cartItems.length === 0}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} onClose={handleCloseAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CartPage;
