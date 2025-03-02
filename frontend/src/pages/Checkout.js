import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/orderSlice';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
      };

      if (paymentMethod === 'cod') {
        const response = await dispatch(createOrder(orderData)).unwrap();
        dispatch(clearCart());
        navigate(`/orders/${response._id}`);
      } else {
        const isRazorpayLoaded = await loadRazorpay();
        if (!isRazorpayLoaded) {
          throw new Error('Razorpay SDK failed to load');
        }

        const response = await dispatch(createOrder(orderData)).unwrap();
        
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: response.total * 100,
          currency: 'INR',
          name: 'Neena Super-Market',
          description: 'Purchase Payment',
          order_id: response.paymentDetails.orderId,
          handler: async (response) => {
            const verifyPayment = await dispatch(verifyPayment({
              orderId: response._id,
              paymentData: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
            })).unwrap();

            if (verifyPayment.success) {
              dispatch(clearCart());
              navigate(`/orders/${response._id}`);
            }
          },
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
          },
          theme: {
            color: '#1976d2',
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderAddressForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Street Address"
          name="street"
          value={shippingAddress.street}
          onChange={handleAddressChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          name="city"
          value={shippingAddress.city}
          onChange={handleAddressChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="State"
          name="state"
          value={shippingAddress.state}
          onChange={handleAddressChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Pincode"
          name="pincode"
          value={shippingAddress.pincode}
          onChange={handleAddressChange}
        />
      </Grid>
    </Grid>
  );

  const renderPaymentMethod = () => (
    <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
      <FormControlLabel
        value="cod"
        control={<Radio />}
        label="Cash on Delivery"
      />
      <FormControlLabel
        value="card"
        control={<Radio />}
        label="Credit/Debit Card"
      />
      <FormControlLabel
        value="upi"
        control={<Radio />}
        label="UPI Payment"
      />
    </RadioGroup>
  );

  const renderOrderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      {cartItems.map((item) => (
        <Box key={item.product._id} sx={{ mb: 2 }}>
          <Grid container>
            <Grid item xs={8}>
              <Typography>{item.product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity: {item.quantity}
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Typography>₹{item.product.price * item.quantity}</Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Grid container>
        <Grid item xs={8}>
          <Typography variant="h6">Total</Typography>
        </Grid>
        <Grid item xs={4} textAlign="right">
          <Typography variant="h6">₹{cartTotal}</Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderAddressForm();
      case 1:
        return renderPaymentMethod();
      case 2:
        return renderOrderSummary();
      default:
        return 'Unknown step';
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="info">
          Your cart is empty. Please add items to proceed with checkout.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Place Order'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;
