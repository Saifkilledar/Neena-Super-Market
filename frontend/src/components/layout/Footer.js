import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Neena Super-Market. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center">
          <Link color="inherit" href="/about">
            About Us
          </Link>{' '}
          |{' '}
          <Link color="inherit" href="/contact">
            Contact
          </Link>{' '}
          |{' '}
          <Link color="inherit" href="/privacy">
            Privacy Policy
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
