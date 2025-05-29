
import { Box, Typography, TextField, Button, CardMedia } from '@mui/material';
import Navbar from './navbar';
import React, { useState } from 'react';
import axios from 'axios';
import './orderservice.css'; // Assuming you have a CSS file for styles


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




// PAGE IS THE CART PAGE EARLIER, NILIPAT LANG KASI D NAGANA FILES
// import React, { useState, useEffect } from 'react';
// import {
//   Box, Typography, Button, IconButton, Checkbox, Divider, Snackbar, Alert
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import Navbar from './navbar';
// import "./orderservice.css"; // Assuming you have a CSS file for styles

// function Order() {
//   const [cartItems, setCartItems] = useState([]);
//   const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

//   useEffect(() => {
//     const storedCart = localStorage.getItem('cart');
//     try {
//       const parsed = JSON.parse(storedCart);
//       if (Array.isArray(parsed)) {
//         setCartItems(parsed);
//       } else {
//         setCartItems([]);
//       }
//     } catch {
//       setCartItems([]);
//     }
//   }, []);

//   const updateQuantity = (productId, change) => {
//     const updated = cartItems.map(item => {
//       if (item._id === productId) {
//         const newQty = item.quantity + change;
//         if (newQty <= 0) return null;
//         return { ...item, quantity: newQty };
//       }
//       return item;
//     }).filter(Boolean);

//     localStorage.setItem('cart', JSON.stringify(updated));
//     setCartItems(updated);
//     showAlert('Quantity updated');
//   };

//   const removeItem = (productId) => {
//     const updated = cartItems.filter(item => item._id !== productId);
//     localStorage.setItem('cart', JSON.stringify(updated));
//     setCartItems(updated);
//     showAlert('Item removed');
//   };

//   const getTotal = () => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

//   const showAlert = (message, severity = 'success') => setAlert({ open: true, message, severity });
//   const handleCloseAlert = () => setAlert({ ...alert, open: false });

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
//         <Typography variant="h4" gutterBottom>Shopping Cart</Typography>

//         {cartItems.length === 0 ? (
//           <Typography>No items in cart.</Typography>
//         ) : (
//           cartItems.map(item => (
//             <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
//               <Box sx={{ flex: 1 }}>
//                 <Typography variant="h6">{item.name}</Typography>
//                 <Typography variant="body2">₱{item.price.toFixed(2)}</Typography>
//                 <Typography variant="body2">Qty: {item.quantity}</Typography>
//               </Box>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <IconButton onClick={() => updateQuantity(item._id, -1)}><RemoveIcon /></IconButton>
//                 <Typography>{item.quantity}</Typography>
//                 <IconButton onClick={() => updateQuantity(item._id, 1)}><AddIcon /></IconButton>
//                 <IconButton onClick={() => removeItem(item._id)}><DeleteIcon color="error" /></IconButton>
//               </Box>
//             </Box>
//           ))
//         )}

//         <Divider sx={{ my: 3 }} />
//         <Box sx={{ textAlign: 'right' }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Total: ₱{getTotal().toFixed(2)}
//           </Typography>
//           <Button
//             variant="contained"
//             color="error"
//             fullWidth
//             disabled={cartItems.length === 0}
//             onClick={() => {
//               localStorage.removeItem('cart');
//               setCartItems([]);
//               showAlert('Checkout complete!');
//             }}
//           >
//             Checkout
//           </Button>
//         </Box>
//       </Box>

//       <Snackbar
//         open={alert.open}
//         autoHideDuration={4000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert severity={alert.severity} onClose={handleCloseAlert}>
//           {alert.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }

// export default Order;



