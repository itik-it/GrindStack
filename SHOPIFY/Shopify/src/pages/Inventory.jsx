import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Inventory.css';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #AB9047',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const columns = [
  { id: 'barcode', label: 'Barcode', minWidth: 120 },
  { id: 'name', label: 'Product Name', minWidth: 170 },
  {
    id: 'price',
    label: 'Price',
    minWidth: 100,
    align: 'right',
    format: (value) => `₱${value.toFixed(2)}`,
  },
  {
    id: 'stock',
    label: 'Current Stock',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 100,
    align: 'center',
  },
];

function Inventory() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modal states
  const [openUpdateStock, setOpenUpdateStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:1337/products`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch products');
      }
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Modal handlers
  const handleOpenUpdateStock = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock.toString());
    setOpenUpdateStock(true);
  };

  const handleCloseUpdateStock = () => {
    setSelectedProduct(null);
    setOpenUpdateStock(false);
  };

  // Update stock handler
  const handleUpdateStock = async () => {
    try {
      await axios.put(`http://localhost:1337/editproductsmongo/${selectedProduct._id}`, {
        ...selectedProduct,
        stock: Number(newStock)
      });
      fetchProducts();
      handleCloseUpdateStock();
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Failed to update stock. Check console for details.');
    }
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="content">
        <h1 className="Title" style={{ color: '#AB9047' }}>Inventory Management</h1>
        
        <div className="inventory-table">
          <Paper sx={{ 
            width: '1550px', 
            overflow: 'hidden', 
            borderTop: '3px solid #AB9047',
            boxShadow: 3,
            borderRadius: '8px',
            margin: '30px'
          }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="inventory table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ 
                          minWidth: column.minWidth, 
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
                  {products
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                        {columns.map((column) => {
                          if (column.id === 'actions') {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Button
                                  variant="contained"
                                  sx={{ 
                                    backgroundColor: '#AB9047',
                                    '&:hover': {
                                      backgroundColor: '#8A7439'
                                    }
                                  }}
                                  onClick={() => handleOpenUpdateStock(row)}
                                >
                                  Update Stock
                                </Button>
                              </TableCell>
                            );
                          }
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={products.length}
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
        </div>

        {/* Update Stock Modal */}
        <Modal
          open={openUpdateStock}
          onClose={handleCloseUpdateStock}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={openUpdateStock}>
            <Box sx={style}>
              <Typography variant="h6" component="h2" mb={2} sx={{ color: '#AB9047', fontWeight: 'bold' }}>
                Update Stock
              </Typography>
              {selectedProduct && (
                <>
                  <Typography variant="body1" mb={2}>
                    <strong>Product:</strong> {selectedProduct.name}
                  </Typography>
                  <Typography variant="body1" mb={3}>
                    <strong>Current Stock:</strong> {selectedProduct.stock}
                  </Typography>
                </>
              )}
              <TextField
                label="New Stock Level"
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                fullWidth
                margin="normal"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#AB9047'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#AB9047'
                  }
                }}
              />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <Button 
                  variant="contained" 
                  onClick={handleUpdateStock}
                  sx={{ 
                    backgroundColor: '#AB9047',
                    '&:hover': {
                      backgroundColor: '#8A7439'
                    }
                  }}
                >
                  Update
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleCloseUpdateStock}
                  sx={{ 
                    borderColor: '#AB9047',
                    color: '#AB9047',
                    '&:hover': {
                      borderColor: '#8A7439',
                      backgroundColor: 'rgba(171, 144, 71, 0.04)'
                    }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </div>
    </div>
  );
}

export default Inventory;
