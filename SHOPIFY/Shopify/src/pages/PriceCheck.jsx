import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import './PointOfSales.css';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function PriceCheck() {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    // Focus the barcode input when the component mounts
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const handleBarcodeChange = (e) => {
    setBarcodeInput(e.target.value);
  };

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    
    setError('');
    
    try {
      const response = await axios.get(`http://localhost:1337/products?barcode=${barcodeInput}`);
      const products = response.data;
      const matchedProduct = products.find(product => product.barcode === barcodeInput);
      
      if (matchedProduct) {
        setProduct(matchedProduct);
      } else {
        setError('Product not found!');
        setProduct(null);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Error scanning product. Please try again.');
      setProduct(null);
    } finally {
      setBarcodeInput('');
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    }
  };

  // Determine availability status styling
  const getStatusStyles = () => {
    if (error) {
      return {
        backgroundColor: '#f44336', // Red for not found
        color: 'white'
      };
    } else if (product) {
      return {
        backgroundColor: '#4caf50', // Green for available
        color: 'white'
      };
    } else {
      return {
        backgroundColor: '#AB9047', // Default gold to match brand
        color: 'white'
      };
    }
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="content" style={{ backgroundColor: 'white' }}>
        <div className="header-container" style={{ 
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '15px',
          marginBottom: '20px'
        }}>
          <h1 className="Title" style={{ color: '#AB9047', fontSize: '2rem' }}>Price Check</h1>
        </div>
        
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
          padding: '0 20px'
        }}>
          <Card 
            sx={{ 
              width: 400,
              height: 450,
              borderRadius: 5,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
              borderTop: '3px solid #AB9047'
            }}
          >
            {/* Status Bar - Red or Green depending on product found */}
            <Box 
              sx={{ 
                flex: '0 0 80px',
                ...getStatusStyles(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {error ? 'Product Not Found' : 
                  product ? 'Product Available' : 'Scan A Product'}
              </Typography>
            </Box>
            
            {/* Item Name Section */}
            <Box 
              sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                backgroundColor: 'white',
                position: 'relative'
              }}
            >
              {product && (
                <>
                  <Box sx={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    backgroundColor: '#eeeeee',
                    padding: '4px 8px',
                    borderRadius: 1
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                      Barcode: {product.barcode}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 3, 
                      textAlign: 'center',
                      color: '#333'
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '10px 30px', 
                    borderRadius: 2,
                    border: '1px dashed #AB9047',
                    mb: 2
                  }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: '#AB9047', 
                        fontWeight: 'bold', 
                        textAlign: 'center' 
                      }}
                    >
                      ₱{product.price.toFixed(2)}
                    </Typography>
                  </Box>
                  {product.stock !== undefined && (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mt: 2,
                        color: product.stock > 0 ? '#4caf50' : '#f44336',
                        fontWeight: 'medium'
                      }}
                    >
                      Stock: <strong>{product.stock}</strong> units
                    </Typography>
                  )}
                </>
              )}
              {!product && !error && (
                <Box sx={{ textAlign: 'center' }}>
                  <Box 
                    component="img" 
                    src="/assets/barcode-scan.png" 
                    alt="Scan barcode"
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      opacity: 0.5,
                      mb: 2
                    }}
                  />
                  <Typography variant="h5" sx={{ color: '#666', textAlign: 'center' }}>
                    Item information will appear here
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                    Scan a barcode to check price and availability
                  </Typography>
                </Box>
              )}
              {error && (
                <Box sx={{ textAlign: 'center' }}>
                  <Box 
                    component="img" 
                    src="/assets/not-found.png" 
                    alt="Not found"
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      opacity: 0.7,
                      mb: 2
                    }}
                  />
                  <Typography variant="h5" sx={{ color: '#f44336', textAlign: 'center', fontWeight: 'medium' }}>
                    {error}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                    Please try another barcode
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Barcode Input Section */}
            <Box 
              component="form"
              onSubmit={handleBarcodeSubmit}
              sx={{ 
                flex: '0 0 80px',
                backgroundColor: '#f5f5f5',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTop: '1px solid #e0e0e0'
              }}
            >
              <TextField
                fullWidth
                placeholder="Scan barcode..."
                value={barcodeInput}
                onChange={handleBarcodeChange}
                variant="outlined"
                inputRef={barcodeInputRef}
                InputProps={{
                  style: { fontSize: '1.2rem', fontWeight: '500' },
                  endAdornment: (
                    <IconButton 
                      type="submit" 
                      sx={{ color: '#AB9047' }}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#AB9047',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#AB9047',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#AB9047'
                  }
                }}
              />
            </Box>
          </Card>
        </Box>
      </div>
    </div>
  );
}

export default PriceCheck;
