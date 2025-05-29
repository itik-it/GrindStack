import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, IconButton, Divider, Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Navbar from './navbar';
import axios from 'axios';
import './orderservice.css';

const CART_API = import.meta.env.VITE_CART_API;

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const res = await axios.get(`${CART_API}/cart/${userId}`);
        const cartData = res.data;

        // Fetch each product's details from the product API
        const productRes = await axios.get(`${import.meta.env.VITE_PRODUCT_API}/products`);
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

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>Shopping Cart</Typography>

        {cartItems.length === 0 ? (
          <Typography>No items in cart.</Typography>
        ) : (
          cartItems.map(item => (
            <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">₱{item.price.toFixed(2)}</Typography>
                <Typography variant="body2">Qty: {item.quantity}</Typography>
              </Box>
            </Box>
          ))
        )}

        <Divider sx={{ my: 3 }} />
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total: ₱{getTotal().toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="error"
            fullWidth
            disabled={cartItems.length === 0}
            onClick={() => showAlert('Checkout functionality pending')}
          >
            Checkout
          </Button>
        </Box>
      </Box>

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
