import React from 'react';
import { Container, Paper, Typography, Grid, Button, Box } from '@mui/material';

const Profile = () => {
  // Placeholder user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-01-01'
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Personal Information</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Name:</strong> {user.name}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Member Since:</strong> {new Date(user.joinDate).toLocaleDateString()}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Edit Profile
            </Button>
            <Button variant="outlined" color="secondary" sx={{ ml: 2 }}>
              Change Password
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
