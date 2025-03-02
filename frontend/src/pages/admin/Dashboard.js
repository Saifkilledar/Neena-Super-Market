import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart,
  People,
  Inventory,
  Assessment,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

// Admin components
import Overview from './Overview';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import CustomerManagement from './CustomerManagement';
import Analytics from './Analytics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '' },
    { text: 'Products', icon: <Inventory />, path: 'products' },
    { text: 'Orders', icon: <ShoppingCart />, path: 'orders' },
    { text: 'Customers', icon: <People />, path: 'customers' },
    { text: 'Analytics', icon: <Assessment />, path: 'analytics' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: 240,
          flexShrink: 0,
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(`/admin/${item.path}`)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
