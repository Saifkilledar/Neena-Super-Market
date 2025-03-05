import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { useSelector } from 'react-redux';

const Cart = () => {
  const navigate = useNavigate();
  
  // Placeholder cart data
  const cartItems = [
    { id: 1, name: 'Sample Product', price: 99.99, quantity: 2 }
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      
      {cartItems.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Your cart is empty</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {cartItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography>{item.name}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>${item.price}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>Qty: {item.quantity}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/checkout')}
                sx={{ mt: 2 }}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Cart;
