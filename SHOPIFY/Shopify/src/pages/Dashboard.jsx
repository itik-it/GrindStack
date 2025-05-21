import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Dashboard.css';
import axios from 'axios';
import { 
  Grid, Card, CardContent, Typography, Box, Button, 
  Paper, Divider, Stack, CircularProgress, Alert 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';

function Dashboard() {
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    transactionCount: 0,
    itemsSold: 0
  });
  const [inventoryData, setInventoryData] = useState({
    totalProducts: 0,
    lowStockCount: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch summary data
        const summaryResponse = await axios.get('http://localhost:1337/sales/summary');
        setSalesData(summaryResponse.data);
        
        // Fetch product data
        const productsResponse = await axios.get('http://localhost:1337/products');
        const products = productsResponse.data;
        
        setInventoryData({
          totalProducts: products.length,
          lowStockCount: products.filter(product => product.stock < 5).length
        });
        
        // Fetch recent sales
        const salesResponse = await axios.get('http://localhost:1337/sales?limit=5');
        setRecentSales(salesResponse.data.slice(0, 5));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Feature navigation cards data
  const features = [
    { 
      title: 'Point of Sales', 
      description: 'Process customer transactions', 
      icon: <ShoppingCartIcon fontSize="large" />,
      link: '/PointOfSales',
      color: '#E3F2FD'
    },
    { 
      title: 'Inventory', 
      description: 'Manage your stock levels', 
      icon: <InventoryIcon fontSize="large" />,
      link: '/Inventory',
      color: '#E8F5E9'
    },
    { 
      title: 'Products', 
      description: 'Add and edit products', 
      icon: <LocalOfferIcon fontSize="large" />,
      link: '/Products',
      color: '#FFF3E0'
    },
    { 
      title: 'Price Check', 
      description: 'Quick price lookup', 
      icon: <PriceCheckIcon fontSize="large" />,
      link: '/PriceCheck',
      color: '#F3E5F5'
    },
    { 
      title: 'Sales Report', 
      description: 'View detailed sales analytics', 
      icon: <AssessmentIcon fontSize="large" />,
      link: '/SalesReport',
      color: '#E0F7FA'
    }
  ];

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="dashboard-container">
        <div className="header-container">
          <h1 className="Title">Dashboard</h1>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress sx={{ color: '#AB9047' }} />
          </Box>
        ) : (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: '8px', boxShadow: 2, borderTop: '3px solid #AB9047' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom color="textSecondary">
                      Total Revenue
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#AB9047', mb: 1 }}>
                      ₱{salesData.totalSales.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      All time sales
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: '8px', boxShadow: 2, borderTop: '3px solid #AB9047' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom color="textSecondary">
                      Products Sold
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#AB9047', mb: 1 }}>
                      {salesData.itemsSold}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total units
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: '8px', boxShadow: 2, borderTop: '3px solid #AB9047' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom color="textSecondary">
                      Inventory Status
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: inventoryData.lowStockCount > 0 ? '#f44336' : '#4caf50', mb: 1 }}>
                      {inventoryData.lowStockCount > 0 ? inventoryData.lowStockCount : 'OK'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {inventoryData.lowStockCount > 0 ? 'Products low on stock' : 'All products well stocked'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Quick Links */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#AB9047' }}>
              Quick Access
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                  <Card 
                    component={Link} 
                    to={feature.link}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textDecoration: 'none',
                      color: 'inherit',
                      backgroundColor: feature.color,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      },
                      borderRadius: '8px'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Box sx={{ color: '#AB9047', mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {/* Recent Transactions */}
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3, borderRadius: '8px', boxShadow: 2, borderTop: '3px solid #AB9047' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#AB9047' }}>
                      Recent Transactions
                    </Typography>
                    <Button 
                      component={Link} 
                      to="/SalesReport"
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderColor: '#AB9047',
                        color: '#AB9047',
                        '&:hover': {
                          borderColor: '#8A7439',
                          backgroundColor: 'rgba(171, 144, 71, 0.04)'
                        }
                      }}
                    >
                      View All
                    </Button>
                  </Box>
                  
                  {recentSales.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      No transactions available
                    </Typography>
                  ) : (
                    <Stack spacing={2} divider={<Divider />}>
                      {recentSales.map((sale) => (
                        <Box key={sale._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {sale.transactionId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(sale.date)}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#AB9047' }}>
                              ₱{sale.totalAmount.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Grid>

              {/* Low Stock Alert */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3, borderRadius: '8px', boxShadow: 2, height: '100%', borderTop: '3px solid #AB9047' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#AB9047' }}>
                      Inventory Status
                    </Typography>
                    <Button 
                      component={Link} 
                      to="/Inventory"
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderColor: '#AB9047',
                        color: '#AB9047',
                        '&:hover': {
                          borderColor: '#8A7439',
                          backgroundColor: 'rgba(171, 144, 71, 0.04)'
                        }
                      }}
                    >
                      Manage
                    </Button>
                  </Box>
                  
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ py: 2 }}>
                    {inventoryData.lowStockCount > 0 ? (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <WarningIcon sx={{ fontSize: 40, color: '#f44336', mr: 1 }} />
                          <Typography variant="h5" color="error">
                            Low Stock Alert
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                          {inventoryData.lowStockCount} products need to be restocked
                        </Typography>
                        <Button 
                          component={Link} 
                          to="/Inventory"
                          variant="contained"
                          sx={{ 
                            backgroundColor: '#AB9047',
                            '&:hover': {
                              backgroundColor: '#8A7439'
                            }
                          }}
                        >
                          Restock Now
                        </Button>
                      </>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50', mr: 1 }} />
                          <Typography variant="h5" sx={{ color: '#4caf50' }}>
                            Stock Levels Good
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ textAlign: 'center' }}>
                          All {inventoryData.totalProducts} products are well stocked
                        </Typography>
                      </>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
