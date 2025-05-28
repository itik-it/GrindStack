import React, { useState, useEffect } from 'react';
import './manageprod.css';
import Navbar from './navbar';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Grid, 
  Modal, 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton,
  Snackbar,
  Alert,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

function ManageProd() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    price: '',
    stock: '',
    description: '',
    category: 'hot',
    imageUrl: ''
  });
  
  // Validation states
  const [formErrors, setFormErrors] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    imageUrl: ''
  });
  
  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint = activeCategory === "all" 
          ? 'http://localhost:1337/api/products' 
          : `http://localhost:1337/api/products/category/${activeCategory}`;
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        showAlert('Failed to load products', 'error');
      }
    };
    
    fetchProducts();
  }, [activeCategory]);
  
  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };
  
  // Show alert helper
  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };
  
  // Handle alert close
  const handleCloseAlert = () => {
    setAlert({...alert, open: false});
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    });
    
    // Clear error for the field being changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle image file upload
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      if (!file.type.match('image.*')) {
        showAlert('Please select an image file', 'error');
        return;
      }
      
      // Compress image before converting to base64
      const compressImage = (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              // Create a canvas and get its context
              const canvas = document.createElement('canvas');
              
              // Calculate new dimensions (max 800px width or height)
              let width = img.width;
              let height = img.height;
              const maxDimension = 800;
              
              if (width > height && width > maxDimension) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else if (height > maxDimension) {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
              
              canvas.width = width;
              canvas.height = height;
              
              // Draw the image on the canvas with the new dimensions
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              // Get the data URL from the canvas with reduced quality
              const dataUrl = canvas.toDataURL(file.type, 0.7); // 0.7 quality
              resolve(dataUrl);
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      };
      
      const compressedImage = await compressImage(file);
      setFormData({
        ...formData,
        imageUrl: compressedImage
      });
    } catch (error) {
      console.error('Error processing image:', error);
      showAlert('Failed to process image', 'error');
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      price: '',
      stock: '',
      description: '',
      category: '',
      imageUrl: ''
    };
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
      isValid = false;
    } else if (formData.name.length > 100) {
      errors.name = 'Product name cannot exceed 100 characters';
      isValid = false;
    }
    
    // Price validation
    if (!formData.price) {
      errors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
      isValid = false;
    }
    
    // Stock validation
    if (formData.stock === '') {
      errors.stock = 'Stock quantity is required';
      isValid = false;
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      errors.stock = 'Stock cannot be negative';
      isValid = false;
    }
    
    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
      isValid = false;
    }
    
    // Category validation
    if (!formData.category) {
      errors.category = 'Category is required';
      isValid = false;
    }
    
    // Image validation (only for new products)
    if (!openEditModal && !formData.imageUrl) {
      errors.imageUrl = 'Product image is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;  // Make sure to return this value
  };
  
  // Handle add product
  const handleAddProduct = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      showAlert('Please fix the errors in the form', 'error');
      return;
    }
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.imageUrl ? [formData.imageUrl] : []
      };
      
      const response = await fetch('http://localhost:1337/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
      
      const savedProduct = await response.json();
      
      // Update products list with the new product
      setProducts([...products, savedProduct]);
      setOpenAddModal(false);
      showAlert('Product added successfully');
      
      // Reset form data
      setFormData({
        productId: '',
        name: '',
        price: '',
        stock: '',
        description: '',
        category: 'hot',
        imageUrl: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
      showAlert(error.message || 'Failed to add product', 'error');
    }
  };
  
  // Handle edit product
  const handleEditProduct = async () => {
    if (!currentProduct) return;
    
    // Validate form before proceeding
    if (!validateForm()) {
      showAlert('Please fix the errors in the form', 'error');
      return;
    }
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.imageUrl ? [formData.imageUrl] : []
      };
      
      const response = await fetch(`http://localhost:1337/api/products/${currentProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      
      const updatedProduct = await response.json();
      
      // Update products list with the updated product
      const updatedProducts = products.map(product => 
        product._id === updatedProduct._id ? updatedProduct : product
      );
      
      setProducts(updatedProducts);
      setOpenEditModal(false);
      showAlert('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      showAlert(error.message || 'Failed to update product', 'error');
    }
  };
  
  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    
    try {
      const response = await fetch(`http://localhost:1337/api/products/${currentProduct._id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      // Remove the deleted product from the list
      const updatedProducts = products.filter(product => product._id !== currentProduct._id);
      setProducts(updatedProducts);
      setOpenDeleteModal(false);
      showAlert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      showAlert(error.message || 'Failed to delete product', 'error');
    }
  };
  
  // Open edit modal with product data
  const openProductEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      productId: product.productId,
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : ''
    });
    setOpenEditModal(true);
  };
  
  // Open delete confirmation modal
  const openProductDeleteModal = (product) => {
    setCurrentProduct(product);
    setOpenDeleteModal(true);
  };
  
  return (
    <div className="manageprod-page manage-prod-container">
      <Navbar />
      <main className="main">
        <div className="main-container">
          <section className="management-section">
            <div className="management-header">
              <h1>Product <span className="highlight">Management</span></h1>
              <p>Add, edit, or remove products from your inventory</p>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<AddIcon />}
                className="add-product-btn"
                onClick={() => setOpenAddModal(true)}
              >
                Add Product
              </Button>
            </div>
            
            <div className="menu-categories">
              <button 
                className={`category-btn ${activeCategory === "hot" ? "active" : ""}`}
                onClick={() => setActiveCategory("hot")}
              >
                Hot Coffee
              </button>
              <button 
                className={`category-btn ${activeCategory === "cold" ? "active" : ""}`}
                onClick={() => setActiveCategory("cold")}
              >
                Cold Brew
              </button>
              <button 
                className={`category-btn ${activeCategory === "specialty" ? "active" : ""}`}
                onClick={() => setActiveCategory("specialty")}
              >
                Specialty
              </button>
              <button 
                className={`category-btn ${activeCategory === "pastries" ? "active" : ""}`}
                onClick={() => setActiveCategory("pastries")}
              >
                Pastries
              </button>
              <button 
                className={`category-btn ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                All Items
              </button>
            </div>
            
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">No products available in this category</div>
            ) : (
              <div className="menu-items-grid">
                {products.map(item => (
                  <Card key={item._id} className="menu-card">
                    <CardMedia
                      component="img"
                      height="180"
                      image={item.images && item.images.length > 0 ? 
                        item.images[0].startsWith('data:') ? item.images[0] : `data:image/jpeg;base64,${item.images[0]}`
                        : 'https://via.placeholder.com/180x180?text=No+Image'}
                      alt={item.name}
                      className="menu-card-img"
                    />
                    <CardContent className="menu-card-content">
                      <Typography variant="h5" component="div" className="menu-item-title">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" className="menu-item-desc">
                        {item.description}
                      </Typography>
                      <div className="menu-card-details">
                        <Typography variant="body2">
                          <strong>ID:</strong> {item.productId}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Stock:</strong> {item.stock} units
                        </Typography>
                      </div>
                      <div className="menu-card-footer">
                        <Typography variant="h6" className="price-tag-menu">
                          ₱{item.price.toFixed(2)}
                        </Typography>
                        <div className="product-actions">
                          <IconButton 
                            color="primary" 
                            aria-label="edit product"
                            onClick={() => openProductEditModal(item)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            aria-label="delete product"
                            onClick={() => openProductDeleteModal(item)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      {/* Add Product Modal */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        aria-labelledby="add-product-modal"
      >
        <Box sx={modalStyle}>
          <div className="modal-header">
            <Typography variant="h6" component="h2">
              Add New Product
            </Typography>
            <IconButton onClick={() => setOpenAddModal(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <Box component="form" className="product-form">
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              error={!!formErrors.price}
              helperText={formErrors.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">₱</InputAdornment>,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="stock"
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              error={!!formErrors.stock}
              helperText={formErrors.stock}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
            <FormControl fullWidth margin="normal" error={!!formErrors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleInputChange}
              >
                <MenuItem value="hot">Hot Coffee</MenuItem>
                <MenuItem value="cold">Cold Brew</MenuItem>
                <MenuItem value="specialty">Specialty</MenuItem>
                <MenuItem value="pastries">Pastries</MenuItem>
              </Select>
              {formErrors.category && (
                <FormHelperText>{formErrors.category}</FormHelperText>
              )}
            </FormControl>
            {/* Image upload section */}
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
              color={formErrors.imageUrl ? "error" : "primary"}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            {formErrors.imageUrl && (
              <FormHelperText error>{formErrors.imageUrl}</FormHelperText>
            )}
            {formData.imageUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '150px' }} 
                />
              </Box>
            )}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </Modal>
      
      {/* Edit Product Modal */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-product-modal"
      >
        <Box sx={modalStyle}>
          <div className="modal-header">
            <Typography variant="h6" component="h2">
              Edit Product
            </Typography>
            <IconButton onClick={() => setOpenEditModal(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <Box component="form" className="product-form">
            <TextField
              margin="normal"
              disabled
              fullWidth
              id="productId"
              label="Product ID"
              name="productId"
              value={formData.productId}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              error={!!formErrors.price}
              helperText={formErrors.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">₱</InputAdornment>,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="stock"
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              error={!!formErrors.stock}
              helperText={formErrors.stock}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
            <FormControl fullWidth margin="normal" error={!!formErrors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleInputChange}
              >
                <MenuItem value="hot">Hot Coffee</MenuItem>
                <MenuItem value="cold">Cold Brew</MenuItem>
                <MenuItem value="specialty">Specialty</MenuItem>
                <MenuItem value="pastries">Pastries</MenuItem>
              </Select>
              {formErrors.category && (
                <FormHelperText>{formErrors.category}</FormHelperText>
              )}
            </FormControl>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Change Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            {formErrors.imageUrl && (
              <FormHelperText error>{formErrors.imageUrl}</FormHelperText>
            )}
            {formData.imageUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '150px' }} 
                />
              </Box>
            )}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleEditProduct}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-product-modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete {currentProduct?.name}? This action cannot be undone.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
      
      {/* Alert Snackbar */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ManageProd;
