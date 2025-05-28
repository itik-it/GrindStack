
import { Box, Typography, TextField, Button, CardMedia } from '@mui/material';
import Navbar from './navbar';
import React, { useState } from 'react';
import axios from 'axios';


function Order() {
  const product = {
    name: 'Coffee Supreme',
    description: 'A rich and aromatic coffee blend made with premium Arabica beans. Perfect for a strong start to your day.',
    price: 150,
    image: 'https://royalkitchenpatong.com/wp-content/uploads/2022/05/BLACK-COFFEE.jpg' // Replace with actual image URL
  };

      const [quantity, setQuantity] = useState(1);

const handleOrder = async () => {
  if (quantity < 1) {
    alert('Quantity must be at least 1');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/orders', {
      userId: 'user123',
      items: [
        {
          productId: 'coffee001',
          name: product.name,
          price: product.price,
          quantity: Number(quantity)
        }
      ]
    });
    alert('Order placed!');
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order.');
  }
};


  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '100vh',
          width: '100vw',
          boxSizing: 'border-box',
        }}
      >
        {/* Left Section with Centered Image */}
        <Box
          sx={{
            flex: 1,
            height: '100%',
            backgroundColor: '#2C1608',
            borderRight: '2px solid #694A38',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '20px',
          }}
        >
          <CardMedia
            component="img"
            image={product.image}
            alt="Product"
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: 3,
            }}
          />
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: 1,
            padding: '64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '32px',
            backgroundColor: '#FFFFFC',
            overflow: 'hidden',
          }}
        >
          <Typography variant="h2" sx={{ color: '#694A38', fontFamily: 'Poppins', fontWeight: 700 }}>
            {product.name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#694A38', fontFamily: 'Poppins', fontWeight: 300, fontSize: '1.1rem' }}>
            {product.description}
          </Typography>
          <Typography variant="h4" sx={{ color: '#694A38', fontFamily: 'Poppins', fontWeight: 600 }}>
            Price: {product.price} petot
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" sx={{ color: '#694A38', fontFamily: 'Poppins' }}>
              Quantity:
            </Typography>
            <TextField type="number" defaultValue={1} sx={{ width: 120 }} inputProps={{ min: 1 }} />
          </Box>

          <TextField
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: 1 }}
            sx={{ width: 120 }}
          />

          <Button variant="contained" sx={{ backgroundColor: '#694A38', color: '#FFFFFC' }} onClick={handleOrder}>
            Place Order
          </Button>

        </Box>
      </Box>
    </>
  );
}

export default Order;






