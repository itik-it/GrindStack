import React, { useState, useEffect } from 'react';
import './manageprod.css';
import Navbar from './navbar';
import {
  Card, CardContent, CardMedia, Typography, Button, Modal, Box,
  TextField, FormControl, InputLabel, Select, MenuItem, IconButton,
  Snackbar, Alert, InputAdornment, FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

function ManageProd() {
  const baseUrl = import.meta.env.VITE_PRODUCT_API;

  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    price: '',
    stock: '',
    description: '',
    category: 'hot',
    imageUrl: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const modalStyle = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: 400,
    bgcolor: 'background.paper', borderRadius: 2,
    boxShadow: 24, p: 4,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint = activeCategory === "all"
          ? `${baseUrl}/products`
          : `${baseUrl}/products/category/${activeCategory}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        showAlert('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'stock'].includes(name) ? parseFloat(value) : value
    }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.match('image.*')) {
      showAlert('Invalid image file', 'error');
      return;
    }

    try {
      // Create a function to compress the image
      const compressImage = (imageFile) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              // Create canvas for compression
              const canvas = document.createElement('canvas');
              // Set max dimensions (adjust as needed)
              const MAX_WIDTH = 600;
              const MAX_HEIGHT = 600;
              
              let width = img.width;
              let height = img.height;
              
              // Calculate new dimensions while maintaining aspect ratio
              if (width > height) {
                if (width > MAX_WIDTH) {
                  height = Math.round(height * MAX_WIDTH / width);
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width = Math.round(width * MAX_HEIGHT / height);
                  height = MAX_HEIGHT;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              // Adjust quality (0.5 = 50% quality) - lower for smaller file size
              const dataUrl = canvas.toDataURL(imageFile.type, 0.5);
              resolve(dataUrl);
            };
            img.onerror = reject;
          };
          reader.onerror = reject;
        });
      };

      const compressedImage = await compressImage(file);
      setFormData(prev => ({ ...prev, imageUrl: compressedImage }));
    } catch (err) {
      console.error('Image compression error:', err);
      showAlert('Image processing failed', 'error');
    }
  };

  const validateForm = () => {
    const errors = {};
    let valid = true;

    if (!formData.name.trim()) { errors.name = 'Name is required'; valid = false; }
    if (!formData.price || formData.price <= 0) { errors.price = 'Price must be > 0'; valid = false; }
    if (formData.stock === '' || formData.stock < 0) { errors.stock = 'Invalid stock'; valid = false; }
    if (!formData.description.trim() || formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
      valid = false;
    }
    if (!formData.category) { errors.category = 'Category is required'; valid = false; }
    if (!openEditModal && !formData.imageUrl) { errors.imageUrl = 'Image is required'; valid = false; }

    setFormErrors(errors);
    return valid;
  };

  const resetFormData = () => setFormData({
    productId: '',
    name: '',
    price: '',
    stock: '',
    description: '',
    category: 'hot',
    imageUrl: ''
  });

  const showAlert = (message, severity = 'success') => setAlert({ open: true, message, severity });
  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const handleAddProduct = async () => {
    if (!validateForm()) return showAlert('Fix form errors', 'error');

    try {
      const res = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: [formData.imageUrl]
        })
      });

      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      setProducts(prev => [...prev, saved]);
      setOpenAddModal(false);
      resetFormData();
      showAlert('Product added');
    } catch (err) {
      console.error(err);
      showAlert('Add failed', 'error');
    }
  };

  // const handleEditProduct = async () => {
  //   if (!validateForm()) return showAlert('Fix form errors', 'error');
  //   try {
  //     const res = await fetch(`${baseUrl}/products/${currentProduct.productId}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         ...formData,
  //         price: parseFloat(formData.price),
  //         stock: parseInt(formData.stock),
  //         images: [formData.imageUrl]
  //       })
  //     });

  //     if (!res.ok) throw new Error(await res.text());
  //     const updated = await res.json();
  //     setProducts(prev => prev.map(p => p.productId === updated.productId ? updated : p));
  //     setOpenEditModal(false);
  //     showAlert('Product updated');
  //   } catch (err) {
  //     console.error(err);
  //     showAlert('Update failed', 'error');
  //   }
  // };

  const handleEditProduct = async () => {
  if (!validateForm()) return showAlert('Fix form errors', 'error');
  try {
    // Use MongoDB's _id instead of productId for update
    const idToUse = currentProduct._id;
    
    if (!idToUse) {
      throw new Error('Cannot update: Missing valid ID');
    }
    
    const res = await fetch(`${baseUrl}/products/${idToUse}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: [formData.imageUrl]
      })
    });

    if (!res.ok) throw new Error(await res.text());
    const updated = await res.json();
    
    // Update the products list after successful update
    setProducts(prev => prev.map(p => p._id === idToUse ? updated : p));
    setOpenEditModal(false);
    showAlert('Product updated successfully');
  } catch (err) {
    console.error('Update error:', err);
    showAlert('Update failed: ' + (err.message || 'Unknown error'), 'error');
  }
};

  // const handleDeleteProduct = async () => {
  //   try {
  //     const res = await fetch(`${baseUrl}/products/${currentProduct.productId}`, { method: 'DELETE' });
  //     if (!res.ok) throw new Error(await res.text());
  //     setProducts(prev => prev.filter(p => p.productId !== currentProduct.productId));
  //     setOpenDeleteModal(false);
  //     showAlert('Product deleted');
  //   } catch (err) {
  //     console.error(err);
  //     showAlert('Delete failed', 'error');
  //   }
  // };

  const handleDeleteProduct = async () => {
  try {
    // Use MongoDB's _id instead of productId for deletion
    const idToUse = currentProduct._id;
    
    if (!idToUse) {
      throw new Error('Cannot delete: Missing valid ID');
    }
    
    const res = await fetch(`${baseUrl}/products/${idToUse}`, { 
      method: 'DELETE' 
    });
    
    if (!res.ok) throw new Error(await res.text());
    
    // Update the products list after successful deletion
    setProducts(prev => prev.filter(p => p._id !== idToUse));
    setOpenDeleteModal(false);
    showAlert('Product deleted successfully');
  } catch (err) {
    console.error('Delete error:', err);
    showAlert('Delete failed: ' + (err.message || 'Unknown error'), 'error');
  }
};

  const openProductEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      productId: product.productId,
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
      imageUrl: product.images?.[0] || ''
    });
    setOpenEditModal(true);
  };

  return (
    <div className="manage-prod-container manageprod-page">
      <Navbar />
      <div className="main">
        <div className="main-container">
          <div className="management-header">
            <h1>Manage Products</h1>
            <Button className="add-product-btn" onClick={() => setOpenAddModal(true)} startIcon={<AddIcon />} variant="contained">
              Add Product
            </Button>
          </div>

          <div className="menu-categories">
            {['hot', 'cold', 'specialty', 'pastries', 'all'].map(cat => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="loading">Loading...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="menu-items-grid">
              {products.map(item => (
                <div key={item.productId} className="menu-card">
                  <Card>
                    <CardMedia
                      component="img"
                      height="180"
                      image={item.images?.[0] || 'https://via.placeholder.com/180'}
                      alt={item.name}
                      className="menu-card-img"
                    />
                    <CardContent className="menu-card-content">
                      <Typography className="menu-item-title" variant="h6">{item.name}</Typography>
                      <Typography className="menu-card-details" variant="body2">
                        ₱{item.price.toFixed(2)} | Stock: {item.stock}
                      </Typography>
                      <div className="product-actions">
                        <IconButton onClick={() => openProductEditModal(item)}><EditIcon /></IconButton>
                        <IconButton onClick={() => { setCurrentProduct(item); setOpenDeleteModal(true); }}><DeleteIcon /></IconButton>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={modalStyle}>
          <div className="modal-header">
            <Typography variant="h6">Add Product</Typography>
            <IconButton onClick={() => setOpenAddModal(false)}><CloseIcon /></IconButton>
          </div>
          <ProductForm {...{ formData, formErrors, handleInputChange, handleImageUpload, handleSubmit: handleAddProduct }} />
        </Box>
      </Modal>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          <div className="modal-header">
            <Typography variant="h6">Edit Product</Typography>
            <IconButton onClick={() => setOpenEditModal(false)}><CloseIcon /></IconButton>
          </div>
          <ProductForm {...{ formData, formErrors, handleInputChange, handleImageUpload, handleSubmit: handleEditProduct, isEdit: true }} />
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Delete Product</Typography>
          <Typography sx={{ mt: 2 }}>Are you sure you want to delete <strong>{currentProduct?.name}</strong>?</Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDeleteProduct}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={alert.severity} onClose={handleCloseAlert}>{alert.message}</Alert>
      </Snackbar>
    </div>
  );
}

function ProductForm({ formData, formErrors, handleInputChange, handleImageUpload, handleSubmit, isEdit = false }) {
  return (
    <div className="modal-content-wrapper">
      {isEdit && (
        <TextField fullWidth margin="normal" label="Product ID" value={formData.productId} disabled />
      )}
      <TextField fullWidth required margin="normal" name="name" label="Name" value={formData.name} onChange={handleInputChange} error={!!formErrors.name} helperText={formErrors.name} />
      <TextField fullWidth required margin="normal" name="price" label="Price" type="number" value={formData.price} onChange={handleInputChange} error={!!formErrors.price} helperText={formErrors.price} InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }} />
      <TextField fullWidth required margin="normal" name="stock" label="Stock" type="number" value={formData.stock} onChange={handleInputChange} error={!!formErrors.stock} helperText={formErrors.stock} />
      <TextField fullWidth required margin="normal" name="description" label="Description" multiline rows={3} value={formData.description} onChange={handleInputChange} error={!!formErrors.description} helperText={formErrors.description} />
      <FormControl fullWidth margin="normal" error={!!formErrors.category}>
        <InputLabel>Category</InputLabel>
        <Select name="category" value={formData.category} label="Category" onChange={handleInputChange}>
          <MenuItem value="hot">Hot Coffee</MenuItem>
          <MenuItem value="cold">Cold Brew</MenuItem>
          <MenuItem value="specialty">Specialty</MenuItem>
          <MenuItem value="pastries">Pastries</MenuItem>
        </Select>
        {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
      </FormControl>
      <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
        {isEdit ? 'Change Image' : 'Upload Image'}
        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
      </Button>
      {formErrors.imageUrl && <FormHelperText error>{formErrors.imageUrl}</FormHelperText>}
      
      {formData.imageUrl && (
        <div className="image-preview-container">
          <img className="image-preview" src={formData.imageUrl} alt="Preview" />
        </div>
      )}
      
      <div className="form-submit-button">
        <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
          {isEdit ? 'Save Changes' : 'Add Product'}
        </Button>
      </div>
    </div>
  );
}

export default ManageProd;
