import React from 'react';
import { Container, Paper, Typography, Grid, Box } from '@mui/material';

const Orders = () => {
  // Placeholder orders data
  const orders = [
    {
      id: '1',
      date: '2024-03-01',
      total: 199.99,
      status: 'Delivered',
      items: [
        { name: 'Sample Product 1', quantity: 2, price: 99.99 }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No orders found</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">Order #{order.id}</Typography>
                  <Typography color="textSecondary">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </Typography>
                  <Typography color="primary">
                    Status: {order.status}
                  </Typography>
                </Box>

                <Box>
                  {order.items.map((item, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography>
                        {item.name} x {item.quantity} - ${item.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">
                    Total: ${order.total}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Orders;
