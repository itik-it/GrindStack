import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './ManageProd.css';
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
import AddCircleIcon from '@mui/icons-material/AddCircle';
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
    format: (value) => `$${value.toFixed(2)}`,
  },
  {
    id: 'stock',
    label: 'Stock',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 120,
    align: 'center',
  },
];

function ManageProd() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Form state for Add/Edit without description
  const initialForm = { barcode: '', name: '', price: '', stock: '' };
  const [formData, setFormData] = useState(initialForm);


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

  // Modal open/close
  const handleOpenAdd = () => {
    setFormData(initialForm);
    setOpenAdd(true);
  };
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setFormData({
      barcode: product.barcode,
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setEditProduct(null);
    setOpenEdit(false);
  };

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  // Add product
  const handleAddProduct = async () => {
    try {
      await axios.post(`http://localhost:1337/addproductsmongo`, formData);
      fetchProducts();
      handleCloseAdd();
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Check console for details.');
    }
  };

  // Edit product
  const handleEditProduct = async () => {
    try {
      await axios.put(`http://localhost:1337/editproductsmongo/${editProduct._id}`, formData);
      fetchProducts();
      handleCloseEdit();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Check console for details.');
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:1337/deleteproductsmongo/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Check console for details.');
    }
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="content">
        <h1 className="Title" style={{ color: '#AB9047' }}>Manage Products</h1>
        <div className="AddProd-Button">
          <Button 
            className="AddProd-Button" 
            startIcon={<AddCircleIcon />} 
            onClick={handleOpenAdd}
            sx={{ 
              backgroundColor: '#AB9047',
              color: 'white',
              '&:hover': {
                backgroundColor: '#8A7439'
              },
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
          >
            Add Product
          </Button>
        </div>

        <div className="PROD-table">
          <Paper sx={{ 
            width: '1550px', 
            overflow: 'hidden', 
            borderTop: '3px solid #AB9047',
            boxShadow: 3,
            borderRadius: '8px'
          }}>
            <TableContainer sx={{ maxHeight: 1200 }}>
              <Table stickyHeader aria-label="sticky table">
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
                                  variant="outlined"
                                  sx={{ 
                                    marginRight: 1,
                                    borderColor: '#AB9047',
                                    color: '#AB9047',
                                    '&:hover': {
                                      borderColor: '#8A7439',
                                      backgroundColor: 'rgba(171, 144, 71, 0.04)'
                                    }
                                  }}
                                  onClick={() => handleOpenEdit(row)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleDelete(row._id)}
                                >
                                  Delete
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

        {/* Add Product Modal */}
        <Modal
          open={openAdd}
          onClose={handleCloseAdd}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={openAdd}>
            <Box sx={style}>
              <Typography variant="h6" component="h2" mb={2} sx={{ color: '#AB9047', fontWeight: 'bold' }}>
                Add New Product
              </Typography>
              <TextField
                label="Barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
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
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
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
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
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
                  onClick={handleAddProduct}
                  sx={{ 
                    backgroundColor: '#AB9047',
                    '&:hover': {
                      backgroundColor: '#8A7439'
                    }
                  }}
                >
                  Add
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleCloseAdd}
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

        {/* Edit Product Modal */}
        <Modal
          open={openEdit}
          onClose={handleCloseEdit}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={openEdit}>
            <Box sx={style}>
              <Typography variant="h6" component="h2" mb={2} sx={{ color: '#AB9047', fontWeight: 'bold' }}>
                Edit Product
              </Typography>
              <TextField
                label="Barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
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
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
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
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
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
                  onClick={handleEditProduct}
                  sx={{ 
                    backgroundColor: '#AB9047',
                    '&:hover': {
                      backgroundColor: '#8A7439'
                    }
                  }}
                >
                  Save
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleCloseEdit}
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

export default ManageProd;
