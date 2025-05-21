import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './SalesReport.css';
import axios from 'axios';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TablePagination, TableRow, Box, Card, CardContent, Typography, 
  TextField, Button, Stack, Grid, Divider, Alert, IconButton
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

function SalesReport() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    transactionCount: 0,
    itemsSold: 0
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchSales();
  }, []);

  // Apply date filters when dates change
  useEffect(() => {
    if (transactions.length > 0) {
      applyFilters();
    }
  }, [startDate, endDate, transactions]);

  // Fetch sales data from API
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:1337/sales');
      setTransactions(response.data);
      setFilteredTransactions(response.data);
      
      // Fetch summary data
      const summaryResponse = await axios.get('http://localhost:1337/sales/summary');
      setSummary(summaryResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError('Failed to load sales data. Please try again.');
      setLoading(false);
    }
  };

  // Apply date filters to transactions
  const applyFilters = () => {
    let filtered = [...transactions];

    if (startDate) {
      const startDateTime = new Date(startDate).setHours(0, 0, 0, 0);
      filtered = filtered.filter(
        transaction => new Date(transaction.date) >= new Date(startDateTime)
      );
    }

    if (endDate) {
      const endDateTime = new Date(endDate).setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        transaction => new Date(transaction.date) <= new Date(endDateTime)
      );
    }

    setFilteredTransactions(filtered);
    calculateSummary(filtered);
  };

  // Calculate summary metrics from filtered transactions
  const calculateSummary = (transactions) => {
    const totalSales = transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
    const itemsSold = transactions.reduce((sum, transaction) => {
      return sum + transaction.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    setSummary({
      totalSales,
      transactionCount: transactions.length,
      itemsSold
    });
  };

  // Handle date filter submission
  const handleFilterSubmit = async () => {
    try {
      setLoading(true);
      
      let url = 'http://localhost:1337/sales';
      const params = {};
      
      if (startDate) {
        params.startDate = new Date(startDate).toISOString().split('T')[0];
      }
      
      if (endDate) {
        params.endDate = new Date(endDate).toISOString().split('T')[0];
      }
      
      // Add query parameters if dates are selected
      if (Object.keys(params).length > 0) {
        url += '?' + new URLSearchParams(params).toString();
      }
      
      const response = await axios.get(url);
      setTransactions(response.data);
      setFilteredTransactions(response.data);
      
      // Fetch updated summary
      const summaryUrl = `http://localhost:1337/sales/summary?${new URLSearchParams(params).toString()}`;
      const summaryResponse = await axios.get(summaryUrl);
      setSummary(summaryResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to filter sales data. Please try again.');
      setLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    fetchSales();
  };

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // View transaction details
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Format date to local string
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
      <div className="sales-report-container">
        <div className="header-container">
          <h1 className="Title">Sales Report</h1>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Date Filter Section */}
        <Card sx={{ mb: 3, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#AB9047' }}>
              Filter Sales by Date
            </Typography>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="MM/DD/YYYY"
                    value={startDate ? dayjs(startDate) : null}
                    onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DesktopDatePicker
                    label="End Date"
                    inputFormat="MM/DD/YYYY"
                    value={endDate ? dayjs(endDate) : null}
                    onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : null)}
                    minDate={startDate ? dayjs(startDate) : null}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={2}>
                    <Button 
                      variant="contained" 
                      startIcon={<FilterListIcon />}
                      onClick={handleFilterSubmit}
                      sx={{ 
                        backgroundColor: '#AB9047',
                        '&:hover': {
                          backgroundColor: '#8A7439'
                        }
                      }}
                    >
                      Apply Filters
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<RestartAltIcon />}
                      onClick={handleResetFilters}
                      sx={{ 
                        borderColor: '#AB9047',
                        color: '#AB9047',
                        '&:hover': {
                          borderColor: '#8A7439',
                          backgroundColor: 'rgba(171, 144, 71, 0.04)'
                        }
                      }}
                    >
                      Reset
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
                  Total Revenue
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#AB9047' }}>
                  ₱{summary.totalSales.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
                  Transactions
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#AB9047' }}>
                  {summary.transactionCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
                  Items Sold
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#AB9047' }}>
                  {summary.itemsSold}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Transactions Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ 
                      fontWeight: 'bold', 
                      backgroundColor: '#AB9047',
                      color: 'white'
                    }}
                  >
                    Transaction ID
                  </TableCell>
                  <TableCell
                    style={{ 
                      fontWeight: 'bold', 
                      backgroundColor: '#AB9047',
                      color: 'white'
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ 
                      fontWeight: 'bold', 
                      backgroundColor: '#AB9047',
                      color: 'white'
                    }}
                  >
                    Items
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ 
                      fontWeight: 'bold', 
                      backgroundColor: '#AB9047',
                      color: 'white'
                    }}
                  >
                    Total Amount
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ 
                      fontWeight: 'bold', 
                      backgroundColor: '#AB9047',
                      color: 'white'
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Loading sales data...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction) => {
                      const itemCount = transaction.items.reduce((sum, item) => sum + item.quantity, 0);
                      
                      return (
                        <TableRow hover key={transaction._id}>
                          <TableCell>{transaction.transactionId}</TableCell>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell align="right">{itemCount}</TableCell>
                          <TableCell align="right">₱{transaction.totalAmount.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleViewTransaction(transaction)}
                              sx={{ color: '#AB9047' }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <Card sx={{ 
            mt: 3, 
            mb: 3,
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#AB9047' }}>
                  Transaction Details
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setSelectedTransaction(null)}
                  sx={{ color: '#AB9047' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Transaction ID</Typography>
                  <Typography variant="body1">{selectedTransaction.transactionId}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                  <Typography variant="body1">{formatDate(selectedTransaction.date)}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Items Purchased</Typography>
              
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Barcode</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTransaction.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.barcode}</TableCell>
                        <TableCell align="right">₱{item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">₱{item.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">Total Amount</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ₱{selectedTransaction.totalAmount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">Amount Received</Typography>
                  <Typography variant="body1">₱{selectedTransaction.amountReceived.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">Change</Typography>
                  <Typography variant="body1">₱{selectedTransaction.change.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SalesReport;
