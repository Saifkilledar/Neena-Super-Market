import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(4),
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const categories = [
  {
    id: 1,
    name: 'Groceries',
    image: '/images/groceries.jpg',
    description: 'Fresh and packaged groceries for your daily needs',
  },
  {
    id: 2,
    name: 'Household',
    image: '/images/household.jpg',
    description: 'Essential household items and cleaning supplies',
  },
  {
    id: 3,
    name: 'Personal Care',
    image: '/images/personal-care.jpg',
    description: 'Health and beauty products for personal care',
  },
  {
    id: 4,
    name: 'Beverages',
    image: '/images/beverages.jpg',
    description: 'Refreshing drinks and beverages',
  },
];

const Home = () => {
  return (
    <>
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            Welcome to Neena Super-Market
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
          >
            Your one-stop shop for groceries, household items, and more.
            Shop from the comfort of your home with our easy-to-use online platform.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/products"
              size="large"
            >
              Shop Now
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={RouterLink}
              to="/register"
              size="large"
            >
              Sign Up
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Shop by Category
        </Typography>

        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={3}>
              <CategoryCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Fast Delivery
              </Typography>
              <Typography variant="body1">
                Get your groceries delivered to your doorstep within hours.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quality Products
              </Typography>
              <Typography variant="body1">
                We ensure all our products meet the highest quality standards.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Best Prices
              </Typography>
              <Typography variant="body1">
                Competitive prices and regular discounts on your favorite items.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Home;
