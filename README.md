# Neena Super-Market E-commerce Platform

A modern, full-stack e-commerce platform built for Neena Super-Market, enabling customers to shop for groceries, household items, and more online. The platform features a responsive design, secure payment processing, and a comprehensive admin dashboard.

## Features

### Customer Features
- **User Authentication**
  - Email-based registration and login
  - JWT-based authentication
  - Password recovery

- **Shopping Experience**
  - Advanced product search with filters
  - Category-based browsing
  - Shopping cart and wishlist
  - Real-time stock updates
  - Product reviews and ratings

- **Checkout Process**
  - Multiple payment options (UPI, Cards, COD)
  - Address management
  - Order tracking
  - Email notifications

- **User Profile**
  - Order history
  - Saved addresses
  - Wishlist management
  - Profile settings

- **Enhanced Shopping Experience**
  - Voice search functionality
  - AR product visualization
  - Smart recommendations
  - Virtual shopping assistant
  - Save for later
  - Social shopping integration

- **Personalization**
  - AI-powered recommendations
  - Customized shopping lists
  - Personalized offers
  - Shopping history analysis
  - Favorite items tracking

- **Loyalty Program**
  - Points system
  - Referral rewards
  - Tier-based benefits
  - Special member prices
  - Birthday rewards

- **Mobile Experience**
  - Progressive Web App
  - Native iOS/Android apps
  - Mobile-specific features
  - Offline capabilities
  - Push notifications

### Admin Features
- **Dashboard**
  - Sales analytics
  - Revenue tracking
  - Customer insights
  - Real-time order monitoring

- **Product Management**
  - Add/Edit/Delete products
  - Bulk upload options
  - Image management
  - Stock tracking
  - Category management

- **Order Management**
  - Order processing
  - Status updates
  - Delivery tracking
  - Payment verification

- **Customer Management**
  - Customer database
  - Order history
  - Support ticket system

- **Enhanced Dashboard**
  - ML-powered analytics
  - Real-time forecasting
  - Competitor monitoring
  - Custom report builder
  - Automated insights

- **Advanced Inventory**
  - Predictive stock management
  - Supplier portal
  - Automated reordering
  - Batch tracking
  - Barcode/QR integration

- **Staff Management**
  - Role-based access
  - Performance tracking
  - Task management
  - Training modules
  - Shift scheduling

- **Sustainability Tracking**
  - Carbon footprint monitoring
  - Eco-packaging metrics
  - Waste reduction tracking
  - Green delivery options
  - Environmental impact reports

### Additional Features
- **Localization**
  - Multi-language support
  - Regional pricing
  - Local tax handling
  - Currency conversion
  - Time zone management

- **Technical Features**
  - Redis caching
  - Image optimization
  - Server-side pagination
  - Service workers
  - GraphQL API

## Tech Stack

### Frontend
- React.js with Hooks
- Redux Toolkit for state management
- Material-UI for design
- Socket.IO for real-time features
- Recharts for analytics visualization
- TypeScript for enhanced type safety
- GraphQL for efficient data fetching
- PWA support for offline capabilities
- AR/VR capabilities for product visualization

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Redis for caching
- JWT with 2FA authentication
- Socket.IO for real-time updates
- Multer & Cloudinary for image handling
- ML services for recommendations
- Docker containerization
- Microservices architecture

### Payment Integration
- Razorpay payment gateway
- Multiple payment methods support
- Secure payment processing
- Multi-currency support
- Subscription management
- Split payment options
- EMI processing
- Digital wallet integration

### DevOps & Security
- CI/CD pipeline
- Docker containers
- Rate limiting
- CAPTCHA integration
- Automated security audits
- Performance monitoring
- Load balancing
- SSL/TLS encryption

## Installation

### Prerequisites
- Node.js >= 14
- MongoDB >= 4.4
- Redis >= 6.0
- Docker & Docker Compose
- TypeScript >= 4.5

1. Clone the repository:
```bash
git clone https://github.com/yourusername/neena-supermarket.git
cd neena-supermarket
```

2. Install dependencies:
```bash
# Install global dependencies
npm install -g typescript ts-node

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd frontend
npm install
```

3. Set up environment variables:

Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
REDIS_URI=your_redis_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SENDGRID_API_KEY=your_sendgrid_key
ML_SERVICE_URL=your_ml_service_url
AR_SERVICE_KEY=your_ar_service_key
```

Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
REACT_APP_AR_SERVICE_KEY=your_ar_service_key
REACT_APP_ANALYTICS_KEY=your_analytics_key
```

4. Start with Docker:
```bash
# Build and start all services
docker-compose up -d

# Or start individual services
docker-compose up -d mongodb redis backend frontend
```

5. Start without Docker:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend in new terminal
cd frontend
npm start
```

## Usage

### Customer Portal
1. Visit `http://localhost:3000`
2. Register a new account or login
3. Browse products by category
4. Add items to cart
5. Proceed to checkout
6. Track your order

### Admin Portal
1. Login with admin credentials:
   - Email: admin@neenasupermarket.com
   - Password: admin123
2. Access dashboard at `/admin`
3. Manage products, orders, and customers
4. View analytics and reports

## Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices

## Security Features

- JWT-based authentication
- Password hashing
- Protected API endpoints
- Secure payment processing
- Input validation and sanitization
- XSS protection
- CORS configuration

## Real-time Features

- Live order tracking
- Stock updates
- Cart synchronization
- Admin notifications
- Live chat support

## Analytics & Reporting

- Sales analytics
- Revenue reports
- Product performance
- Customer behavior insights
- Payment method analysis
- Category-wise sales

## Roadmap

Completed Enhancements:
- [x] TypeScript migration
- [x] GraphQL implementation
- [x] Docker containerization
- [x] Redis caching
- [x] PWA support
- [x] Multi-language support

Upcoming Features:
- [ ] AR/VR product visualization
- [ ] Voice search integration
- [ ] ML-powered recommendations
- [ ] Carbon footprint tracking
- [ ] Supplier portal
- [ ] Native mobile apps
- [ ] Advanced analytics dashboard
- [ ] Automated security testing
- [ ] Microservices architecture
- [ ] Blockchain integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@neenasupermarket.com or join our Slack channel.

## Acknowledgments

- Material-UI for the awesome component library
- Recharts for the beautiful charts
- All our contributors and supporters