# Neena Super-Market Frontend

This directory contains the frontend React application for the Neena Super-Market e-commerce platform.

## Directory Structure

```
frontend/
├── public/         # Static files
├── src/
│   ├── components/ # Reusable components
│   ├── pages/      # Page components
│   ├── hooks/      # Custom React hooks
│   ├── utils/      # Utility functions
│   ├── store/      # Redux store
│   ├── services/   # API services
│   └── locales/    # i18n translations
```

## Key Features

1. **User Experience**
   - Voice search functionality
   - Product recommendations
   - Real-time stock updates
   - AR product view

2. **Mobile Experience**
   - Progressive Web App (PWA)
   - Offline support
   - Touch-optimized UI
   - Responsive design

3. **Localization**
   - Multi-language support (English, Hindi)
   - Regional pricing
   - Local currency support

4. **Customer Engagement**
   - Loyalty program interface
   - Social media integration
   - Customer feedback system
   - Referral program

5. **Analytics**
   - Sales dashboards
   - Customer insights
   - Product performance metrics
   - Real-time analytics

6. **Security**
   - 2FA integration
   - CAPTCHA verification
   - Secure payment forms

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request
