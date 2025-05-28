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

    const compressImage = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width, height = img.height;
            const max = 800;
            if (width > max || height > max) {
              if (width > height) {
                height *= max / width;
                width = max;
              } else {
                width *= max / height;
                height = max;
              }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL(file.type, 0.7));
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const base64 = await compressImage(file);
      setFormData(prev => ({ ...prev, imageUrl: base64 }));
    } catch (err) {
      console.error('Image error:', err);
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

  const handleEditProduct = async () => {
    if (!validateForm()) return showAlert('Fix form errors', 'error');
    try {
      const res = await fetch(`${baseUrl}/products/${currentProduct._id}`, {
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
      setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
      setOpenEditModal(false);
      showAlert('Product updated');
    } catch (err) {
      console.error(err);
      showAlert('Update failed', 'error');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await fetch(`${baseUrl}/products/${currentProduct._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setProducts(prev => prev.filter(p => p._id !== currentProduct._id));
      setOpenDeleteModal(false);
      showAlert('Product deleted');
    } catch (err) {
      console.error(err);
      showAlert('Delete failed', 'error');
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
    <div className="manageprod-page">
      <Navbar />
      <div className="main">
        <h1>Manage Products</h1>
        <Button onClick={() => setOpenAddModal(true)} startIcon={<AddIcon />} variant="contained">Add Product</Button>
        <div className="menu-categories">
          {['hot', 'cold', 'specialty', 'pastries', 'all'].map(cat => (
            <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="product-list">
            {products.map(item => (
              <Card key={item._id}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.images?.[0] || 'https://via.placeholder.com/180'}
                  alt={item.name}
                />
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">₱{item.price.toFixed(2)} | Stock: {item.stock}</Typography>
                  <IconButton onClick={() => openProductEditModal(item)}><EditIcon /></IconButton>
                  <IconButton onClick={() => { setCurrentProduct(item); setOpenDeleteModal(true); }}><DeleteIcon /></IconButton>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={modalStyle}>
          <div className="modal-header">
            <Typography variant="h6">Add Product</Typography>
            <IconButton onClick={() => setOpenAddModal(false)}><CloseIcon /></IconButton>
          </div>
          <ProductForm handleSubmit={handleAddProduct} formData={formData} formErrors={formErrors} handleInputChange={handleInputChange} handleImageUpload={handleImageUpload} />
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          <div className="modal-header">
            <Typography variant="h6">Edit Product</Typography>
            <IconButton onClick={() => setOpenEditModal(false)}><CloseIcon /></IconButton>
          </div>
          <ProductForm handleSubmit={handleEditProduct} formData={formData} formErrors={formErrors} handleInputChange={handleInputChange} handleImageUpload={handleImageUpload} isEdit />
        </Box>
      </Modal>

      {/* Delete Confirmation */}
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

      {/* Alerts */}
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={alert.severity} onClose={handleCloseAlert}>{alert.message}</Alert>
      </Snackbar>
    </div>
  );
}

function ProductForm({ formData, formErrors, handleInputChange, handleImageUpload, handleSubmit, isEdit = false }) {
  return (
    <>
      {isEdit && (
        <TextField
          fullWidth margin="normal" label="Product ID" value={formData.productId}
          disabled
        />
      )}
      <TextField
        fullWidth required margin="normal" name="name" label="Name"
        value={formData.name} onChange={handleInputChange}
        error={!!formErrors.name} helperText={formErrors.name}
      />
      <TextField
        fullWidth required margin="normal" name="price" label="Price" type="number"
        value={formData.price} onChange={handleInputChange}
        error={!!formErrors.price} helperText={formErrors.price}
        InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
      />
      <TextField
        fullWidth required margin="normal" name="stock" label="Stock" type="number"
        value={formData.stock} onChange={handleInputChange}
        error={!!formErrors.stock} helperText={formErrors.stock}
      />
      <TextField
        fullWidth required margin="normal" name="description" label="Description" multiline rows={3}
        value={formData.description} onChange={handleInputChange}
        error={!!formErrors.description} helperText={formErrors.description}
      />
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
      {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '100%', marginTop: '1rem' }} />}
      <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
        {isEdit ? 'Save Changes' : 'Add Product'}
      </Button>
    </>
  );
}

export default ManageProd;
