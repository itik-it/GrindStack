import React from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Divider, Card, CardContent, Grid, Box
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar';

function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.cartItems) {
    navigate('/cartPage');
    return null;
  }

  const { cartItems, total } = state;

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
                  Period: 11/01/2023 - 11/30/2023
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default OrderSummary;
