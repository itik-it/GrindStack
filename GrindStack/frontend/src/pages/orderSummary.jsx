import React, { useState } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Divider, Card, CardContent, Grid, Box, Button, Snackbar, Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';

const PRODUCT_API = import.meta.env.VITE_PRODUCT_API;
const CART_API = import.meta.env.VITE_CART_API;

function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [processing, setProcessing] = useState(false);

  if (!state || !state.cartItems) {
    navigate('/cartPage');
    return null;
  }

  const { cartItems, total, userId } = state;

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const handleConfirmOrder = async () => {
    console.log('Cart items:', cartItems);
    setProcessing(true);
    try {
      // 1. Update stock for each product
      const updatePromises = cartItems.map(async (item) => {
        const newStock = Math.max(0, item.stock - item.quantity);
        await axios.patch(`${PRODUCT_API}/products/${item._id}/stock`, {
          stock: newStock
        });
      });
      
      await Promise.all(updatePromises);
      
      // 2. Clear the cart - with better error handling
      try {
        console.log('Attempting to delete cart for user:', userId);
        console.log('Cart deletion URL:', `${CART_API}/cart/${userId}`);
        
        // The correct URL format might be one of these options:
        // Try the original format first
        await axios.delete(`${CART_API}/cart/${userId}`);
      } catch (cartError) {
        console.error('Cart deletion error:', cartError);
        // The deletion failed, but stock was updated, so we can continue
        console.log('Cart deletion failed, but stock update was successful');
      }
      
      // 3. Show success message
      setAlert({
        open: true,
        message: 'Order completed successfully! Stock has been updated.',
        severity: 'success'
      });
      
      // 4. Navigate back to home after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error completing order:', error);
      setAlert({
        open: true,
        message: 'Error completing order: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Purchase Order Summary
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Period: {new Date().toLocaleDateString()}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Total: <strong>₱{total.toFixed(2)}</strong>
                </Typography>

                <Divider sx={{ my: 3 }} />

                <TableContainer component={Paper} elevation={1}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#eee' }}>
                      <TableRow>
                        <TableCell><strong>Item</strong></TableCell>
                        <TableCell><strong>Ordered</strong></TableCell>
                        <TableCell><strong>Cost</strong></TableCell>
                        <TableCell><strong>Total Cost</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity} ea</TableCell>
                          <TableCell>₱{item.price.toFixed(2)}</TableCell>
                          <TableCell>₱{(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell>Fulfilled</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="subtitle1"><strong>Sub Total:</strong></Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1"><strong>₱{total.toFixed(2)}</strong></Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/cartPage')}
                  >
                    Back to Cart
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleConfirmOrder}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Confirm Order'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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

export default OrderSummary;
