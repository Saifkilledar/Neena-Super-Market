import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

const ProductDetail = () => {
  const { id } = useParams();
  
  // Placeholder for product details
  const product = {
    name: 'Sample Product',
    price: 99.99,
    description: 'This is a sample product description.',
    image: 'https://via.placeholder.com/400'
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img 
              src={product.image} 
              alt={product.name}
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail;
