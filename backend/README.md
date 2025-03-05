# Neena Super-Market Backend

This directory contains the backend server implementation for the Neena Super-Market e-commerce platform.

## Directory Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
└── scripts/        # Database scripts
```

## Key Features

1. **Performance Optimizations**
   - In-memory caching with node-cache
   - Image optimization with sharp
   - Server-side pagination

2. **Security**
   - Two-factor authentication (2FA)
   - Rate limiting
   - XSS protection
   - MongoDB query sanitization
   - CAPTCHA verification

3. **Payment Processing**
   - Multiple payment methods support
   - Transaction handling
   - Invoice generation

4. **Inventory Management**
   - Stock tracking
   - Low stock alerts
   - Predictive reordering

5. **Analytics**
   - Sales tracking
   - Customer metrics
   - Product performance
   - Advanced reporting

6. **Sustainability**
   - Carbon footprint tracking
   - Eco-friendly packaging metrics
   - Environmental impact reporting

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## API Documentation

The API documentation is available at `/api-docs` when running the server in development mode.

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request
