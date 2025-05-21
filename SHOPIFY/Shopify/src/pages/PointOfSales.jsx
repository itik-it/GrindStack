import React, { useEffect, useState, useRef } from 'react';
import Sidebar from './Sidebar'
import './PointOfSales.css'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Stack } from "@mui/material";
import axios from 'axios';

function PointOfSales() {
  const [cartItems, setCartItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    barcode: '',
    name: '',
    price: 0
  });
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({
    totalDue: 0,
    amountReceived: 0,
    change: 0
  });
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [cartItems]);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setPaymentInfo(prev => ({
      ...prev,
      totalDue: total,
      change: prev.amountReceived - total
    }));
  }, [cartItems]);

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    
    try {
      const response = await axios.get(`http://localhost:1337/products?barcode=${barcodeInput}`);
      const products = response.data;
      const matchedProduct = products.find(product => product.barcode === barcodeInput);
      
      if (matchedProduct) {
        // Check if product is in stock
        if (matchedProduct.stock <= 0) {
          alert('Product is out of stock!');
          setBarcodeInput('');
          return;
        }
        
        setCurrentItem({
          barcode: matchedProduct.barcode,
          name: matchedProduct.name,
          price: matchedProduct.price
        });
        
        const existingItemIndex = cartItems.findIndex(item => item.barcode === matchedProduct.barcode);
        
        if (existingItemIndex >= 0) {
          const updatedCart = [...cartItems];
          // Check if requested quantity exceeds available stock
          if (updatedCart[existingItemIndex].quantity + 1 > matchedProduct.stock) {
            alert(`Cannot add more of this item. Only ${matchedProduct.stock} in stock.`);
          } else {
            updatedCart[existingItemIndex].quantity += 1;
            setCartItems(updatedCart);
          }
        } else {
          setCartItems([...cartItems, {
            barcode: matchedProduct.barcode,
            name: matchedProduct.name,
            price: matchedProduct.price,
            quantity: 1,
            subtotal: matchedProduct.price,
            maxStock: matchedProduct.stock // Store max stock for reference
          }]);
        }
        
        setBarcodeInput('');
      } else {
        alert('Product not found!');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Error scanning product. Please try again.');
    }
  };

  const handleQuantityChange = async (barcode, newQuantity) => {
    try {
      // Get the latest stock information for this product
      const response = await axios.get(`http://localhost:1337/products?barcode=${barcode}`);
      const products = response.data;
      const product = products.find(p => p.barcode === barcode);
      
      if (!product) {
        alert('Product not found!');
        return;
      }
      
      const quantity = Math.max(1, parseInt(newQuantity) || 1);
      
      // Check if requested quantity exceeds stock
      if (quantity > product.stock) {
        alert(`Cannot set quantity to ${quantity}. Only ${product.stock} in stock.`);
        
        // Update the cart with maximum available quantity
        const updatedCart = cartItems.map(item => {
          if (item.barcode === barcode) {
            return {
              ...item,
              quantity: product.stock,
              subtotal: item.price * product.stock,
              maxStock: product.stock
            };
          }
          return item;
        });
        setCartItems(updatedCart);
        return;
      }
      
      // Update the cart with the requested quantity
      const updatedCart = cartItems.map(item => {
        if (item.barcode === barcode) {
          return {
            ...item,
            quantity,
            subtotal: item.price * quantity,
            maxStock: product.stock
          };
        }
        return item;
      });
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error checking product stock:', error);
      alert('Error updating quantity. Please try again.');
    }
  };

  const handleRemoveItem = (barcode) => {
    setCartItems(cartItems.filter(item => item.barcode !== barcode));
  };

  const handleAmountReceived = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setPaymentInfo({
      ...paymentInfo,
      amountReceived: amount,
      change: amount - paymentInfo.totalDue
    });
  };

  const handleCompute = async () => {
    if (paymentInfo.amountReceived < paymentInfo.totalDue) {
      alert('Insufficient payment amount!');
      return;
    }
    
    try {
      // Create the transaction object
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Get the user info from localStorage if available
      const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const cashierId = userInfo ? userInfo.UID : 'anonymous';
      
      // Format the cart items for the sales record, but don't include productId if it's not available
      const saleItems = cartItems.map(item => {
        // Return only fields we know exist and are valid
        return {
          barcode: item.barcode,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        };
      });
      
      // Create the sale transaction record
      const saleData = {
        transactionId,
        items: saleItems,
        totalAmount: paymentInfo.totalDue,
        amountReceived: paymentInfo.amountReceived,
        change: paymentInfo.change,
        cashierId,
        date: new Date().toISOString()
      };
      
      console.log('Saving transaction data:', saleData);
      
      // Save the sale transaction to the database
      const saveResponse = await axios.post('http://localhost:1337/sales', saleData);
      console.log('Transaction saved:', saveResponse.data);
      
      // Update stock for all products in cart
      for (const item of cartItems) {
        const response = await axios.get(`http://localhost:1337/products?barcode=${item.barcode}`);
        const products = response.data;
        const product = products.find(p => p.barcode === item.barcode);
        
        if (product) {
          const newStock = product.stock - item.quantity;
          
          // Update the stock in the database
          await axios.put(`http://localhost:1337/editproductsmongo/${product._id}`, {
            ...product,
            stock: newStock
          });
        }
      }
      
      alert(`Transaction complete! Transaction ID: ${transactionId}. Change: ₱${paymentInfo.change.toFixed(2)}`);
      handleNewTransaction();
    } catch (error) {
      // More detailed error handling
      console.error('Error completing transaction:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        alert(`Transaction error: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        alert('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert(`Error: ${error.message || 'Unknown error occurred'}`);
      }
    }
  };

  const handleNewTransaction = () => {
    setCartItems([]);
    setCurrentItem({ barcode: '', name: '', price: 0 });
    setPaymentInfo({ totalDue: 0, amountReceived: 0, change: 0 });
    setBarcodeInput('');
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="POS">
        <div className="header-container">
          <h1 className="Title">Point of Sales</h1>
        </div>
        
        <div className="POS-table">
          <StickyHeadTable 
            rows={cartItems} 
            handleQuantityChange={handleQuantityChange}
            handleRemoveItem={handleRemoveItem}
          />
        </div>
        <div className="current-item">
          <CurrentInfoCard 
            currentItem={currentItem} 
            barcodeInput={barcodeInput} 
            setBarcodeInput={setBarcodeInput} 
            handleBarcodeSubmit={handleBarcodeSubmit} 
            barcodeInputRef={barcodeInputRef} 
          />
        </div>
      </div>
      <div className="POS-totals">
        <PaymentSummaryCard 
          totalDue={paymentInfo.totalDue}
          amountReceived={paymentInfo.amountReceived}
          change={paymentInfo.change}
          handleAmountReceived={handleAmountReceived}
        />
        <ButtonsCard 
          handleCompute={handleCompute}
          handleNewTransaction={handleNewTransaction}
          handleCancel={() => handleNewTransaction()}
        />
      </div>
    </div>  
  )
}

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

function ButtonsCard({ handleCompute, handleNewTransaction, handleCancel }) {
  return (
    <Card sx={{ 
      minWidth: 275, 
      maxHeight: '29%', 
      boxShadow: 3,
      borderTop: '3px solid #AB9047' 
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box className='POS-btns' sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box className='POS-btns-1' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleCancel} 
              startIcon={<span role="img" aria-label="cancel">❌</span>}
              sx={{ 
                minWidth: '150px', 
                fontWeight: 'bold',
                borderRadius: '8px',
                py: 1
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                minWidth: '150px', 
                fontWeight: 'bold',
                borderRadius: '8px',
                py: 1,
                borderColor: '#AB9047',
                color: '#AB9047',
                '&:hover': {
                  borderColor: '#8A7439',
                  backgroundColor: 'rgba(171, 144, 71, 0.04)'
                }
              }}
              onClick={handleNewTransaction}
              startIcon={<span role="img" aria-label="new">🔄</span>}
            >
              New Transaction
            </Button>
          </Box>
          <Box className='POS-btns-2' sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="contained"
              onClick={handleCompute}
              size="large"
              startIcon={<span role="img" aria-label="compute">✓</span>}
              sx={{ 
                minWidth: '180px', 
                height: '100px',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                borderRadius: '8px',
                backgroundColor: '#AB9047',
                '&:hover': {
                  backgroundColor: '#8A7439'
                }
              }}
            >
              Compute
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function PaymentSummaryCard({ totalDue, amountReceived, change, handleAmountReceived }) {
  return (
    <Card sx={{ 
      maxWidth: 400, 
      p: 2, 
      height: '62%',
      borderTop: '3px solid #AB9047'
    }}>
      <CardContent>
        <Stack spacing={3}>
          <TextField
            label="Total Due"
            variant="outlined"
            fullWidth
            value={`₱${totalDue.toFixed(2)}`}
            InputProps={{
              readOnly: true,
              style: { height: '130px', fontSize: '1.4rem', color: '#AB9047', fontWeight: 'bold' }
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                height: '130px',
                '&.Mui-focused fieldset': {
                  borderColor: '#AB9047'
                }
              },
              '& .MuiInputLabel-root': { 
                fontSize: '1.2rem',
                fontWeight: 'bold',
                lineHeight: '0.8em',
                transform: 'translate(14px, -14px) scale(0.75)',
                backgroundColor: 'white',
                padding: '0 8px',
                color: '#AB9047'
              },
              mb: 1
            }}
          />
          <TextField
            label="Amount Received"
            variant="outlined"
            fullWidth
            value={amountReceived}
            onChange={handleAmountReceived}
            InputProps={{
              style: { height: '130px', fontSize: '1.4rem' }
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                height: '130px',
                '&.Mui-focused fieldset': {
                  borderColor: '#AB9047'
                }
              },
              '& .MuiInputLabel-root': { 
                fontSize: '1.2rem',
                fontWeight: 'bold',
                lineHeight: '0.8em',
                transform: 'translate(14px, -14px) scale(0.75)',
                backgroundColor: 'white',
                padding: '0 8px',
                '&.Mui-focused': {
                  color: '#AB9047'
                }
              },
              mb: 1
            }}
          />
          <TextField
            label="Change"
            variant="outlined"
            fullWidth
            value={`₱${change.toFixed(2)}`}
            InputProps={{
              readOnly: true,
              style: { height: '130px', fontSize: '1.4rem', color: '#2e7d32', fontWeight: 'bold' }
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                height: '130px',
                '&.Mui-focused fieldset': {
                  borderColor: '#AB9047'
                }
              },
              '& .MuiInputLabel-root': { 
                fontSize: '1.2rem',
                fontWeight: 'bold',
                lineHeight: '0.8em',
                transform: 'translate(14px, -14px) scale(0.75)',
                backgroundColor: 'white',
                padding: '0 8px',
                color: '#2e7d32'
              }
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function CurrentInfoCard({ currentItem, barcodeInput, setBarcodeInput, handleBarcodeSubmit, barcodeInputRef }) {
  return (
    <Box sx={{ maxWidth: 1100, mt: 2 }}>
      <Card variant="outlined" sx={{ borderTop: '3px solid #AB9047' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#AB9047' }}>
            Current Item Information
          </Typography>

          <Box component="form" onSubmit={handleBarcodeSubmit} sx={{ mb: 2 }}>
            <TextField
              label="Scan Barcode"
              variant="outlined"
              fullWidth
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan or enter barcode..."
              inputRef={barcodeInputRef}
              autoFocus
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#AB9047'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#AB9047'
                }
              }}
              InputProps={{
                style: { fontSize: '1.2rem', fontWeight: 'bold' },
                endAdornment: (
                  <Button 
                    variant="contained" 
                    type="submit"
                    size="small"
                    sx={{ 
                      ml: 1,
                      backgroundColor: '#AB9047',
                      '&:hover': {
                        backgroundColor: '#8A7439'
                      }
                    }}
                  >
                    Enter
                  </Button>
                )
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Item Name"
                variant="outlined"
                fullWidth
                disabled
                value={currentItem.name}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(171, 144, 71, 0.3)'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(171, 144, 71, 0.7)'
                  }
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                disabled
                value={currentItem.price ? `₱${currentItem.price.toFixed(2)}` : '₱0.00'}
                InputProps={{
                  style: { color: '#AB9047', fontWeight: 'bold' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(171, 144, 71, 0.3)'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(171, 144, 71, 0.7)'
                  }
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

const columns = [
  { id: 'barcode', label: 'Barcode' },
  { id: 'name', label: 'Product Name' },
  { id: 'price', label: 'Price', align: 'right', format: (value) => `₱${value.toFixed(2)}` },
  { id: 'quantity', label: 'Quantity', align: 'right' },
  { id: 'subtotal', label: 'Subtotal', align: 'right', format: (value) => `₱${value.toFixed(2)}` },
  { id: 'actions', label: 'Actions', align: 'center' }
];

function StickyHeadTable({ rows, handleQuantityChange, handleRemoveItem }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ 
      width: '1100px', 
      height: '440px', 
      overflow: 'hidden',
      borderTop: '3px solid #AB9047' 
    }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ 
                    minWidth: 150, 
                    fontWeight: 'bold', 
                    backgroundColor: '#AB9047',
                    color: 'white'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.barcode}>
                    {columns.map((column) => {
                      if (column.id === 'actions') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <button onClick={() => handleRemoveItem(row.barcode)}>
                              Remove
                            </button>
                          </TableCell>
                        );
                      }
                      
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'quantity' ? (
                            <input 
                              type="number" 
                              value={value} 
                              min="1"
                              onChange={(e) => handleQuantityChange(row.barcode, e.target.value)}
                              style={{ width: '60px', textAlign: 'right' }}
                            />
                          ) : (
                            column.format && typeof value === 'number'
                              ? column.format(value)
                              : value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '.MuiTablePagination-selectIcon': {
            color: '#AB9047'
          },
          '.MuiTablePagination-actions button:hover': {
            backgroundColor: 'rgba(171, 144, 71, 0.1)'
          },
          '.MuiTablePagination-actions button svg': {
            color: '#AB9047'
          }
        }}
      />
    </Paper>
  );
}

export default PointOfSales;
