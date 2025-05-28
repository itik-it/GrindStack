/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert, IconButton, Checkbox, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import Navbar from './navbar';

const userId = sessionStorage.getItem('userId');
const CART_API = import.meta.env.VITE_CART_API;

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${CART_API}/cart/${userId}`);
        setCartItems(res.data);
      } catch (err) {
        showAlert('Failed to fetch cart', 'error');
      }
    };

    fetchCart();
  }, []);

  const addOrUpdateProduct = async (productId, change) => {
    const current = cartItems.find(i => i.productId === productId);
    const newQty = (current?.quantity || 0) + change;
    if (newQty <= 0) return removeProduct(productId);

    try {
      await axios.post(`${CART_API}/cart/${userId}/add`, { productId, quantity: change });
      fetchCart();
      showAlert('Cart updated');
    } catch {
      showAlert('Failed to update cart', 'error');
    }
  };

  const removeProduct = async (productId) => {
    try {
      await axios.post(`${CART_API}/cart/${userId}/remove`, { productId });
      fetchCart();
      showAlert('Item removed');
    } catch {
      showAlert('Failed to remove item', 'error');
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(`${CART_API}/cart/${userId}/checkout`);
      fetchCart();
      showAlert('Checkout successful!');
    } catch {
      showAlert('Checkout failed', 'error');
    }
  };

  const getTotal = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const showAlert = (message, severity = 'success') => setAlert({ open: true, message, severity });
  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const toggleSelect = (id) => setSelected(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <Navbar />
      <Box className="cart-container">
        <Box className="cart-inner">
          <Box className="cart-items">
            <Typography variant="h5" gutterBottom>Shopping Cart</Typography>
            {cartItems.length === 0 ? (
              <Typography>No items in cart.</Typography>
            ) : (
              cartItems.map(item => (
                <Box key={item.productId} className="cart-item">
                  <Checkbox checked={!!selected[item.productId]} onChange={() => toggleSelect(item.productId)} />
                  <Box className="item-info">
                    <Typography variant="body1" fontWeight="bold">{item.productId}</Typography>
                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  </Box>
                  <Box className="item-controls">
                    <IconButton onClick={() => addOrUpdateProduct(item.productId, -1)}><RemoveIcon /></IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton onClick={() => addOrUpdateProduct(item.productId, 1)}><AddIcon /></IconButton>
                    <IconButton onClick={() => removeProduct(item.productId)}><DeleteIcon color="error" /></IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Box>
          <Box className="cart-summary">
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Typography>Total Items: {getTotal()}</Typography>
            <Divider sx={{ my: 2 }} />
            <Button variant="contained" color="error" fullWidth onClick={handleCheckout}>
              Checkout
            </Button>
          </Box>
        </Box>
        <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={alert.severity} onClose={handleCloseAlert}>{alert.message}</Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default CartPage;
