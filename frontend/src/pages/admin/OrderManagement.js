import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../redux/slices/orderSlice';

const orderStatuses = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusUpdate = async () => {
    try {
      await dispatch(updateOrderStatus({
        orderId: selectedOrder._id,
        status: newStatus,
        location,
      })).unwrap();
      setStatusDialogOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
      setLocation('');
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const openStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const closeStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
    setNewStatus('');
    setLocation('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Order Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>
                  {order.user.name}
                  <br />
                  <Typography variant="caption" color="textSecondary">
                    {order.user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.items.map((item) => (
                    <div key={item._id}>
                      {item.product.name} x {item.quantity}
                    </div>
                  ))}
                </TableCell>
                <TableCell>₹{order.total}</TableCell>
                <TableCell>
                  <Typography
                    color={
                      order.status === 'delivered'
                        ? 'success.main'
                        : order.status === 'cancelled'
                        ? 'error.main'
                        : 'primary.main'
                    }
                  >
                    {order.status.toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color={
                      order.paymentStatus === 'completed'
                        ? 'success.main'
                        : order.paymentStatus === 'failed'
                        ? 'error.main'
                        : 'warning.main'
                    }
                  >
                    {order.paymentStatus.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {order.paymentMethod.toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openStatusDialog(order)}
                  >
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={statusDialogOpen} onClose={closeStatusDialog}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                {orderStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter current location of the order"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStatusDialog}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;
