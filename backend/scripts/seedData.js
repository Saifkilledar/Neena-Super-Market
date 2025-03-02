require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Fresh Tomatoes',
    description: 'Ripe, fresh tomatoes perfect for salads and cooking',
    price: 40,
    category: 'vegetables',
    brand: 'Farm Fresh',
    stock: 100,
    unit: 'kg',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/tomatoes.jpg',
        public_id: 'tomatoes',
      },
    ],
  },
  {
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread',
    price: 35,
    category: 'groceries',
    brand: 'Healthy Bake',
    stock: 50,
    unit: 'pack',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/bread.jpg',
        public_id: 'bread',
      },
    ],
  },
  {
    name: 'Milk',
    description: 'Fresh cow milk, pasteurized and homogenized',
    price: 60,
    category: 'dairy',
    brand: 'Pure Dairy',
    stock: 75,
    unit: 'litre',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/milk.jpg',
        public_id: 'milk',
      },
    ],
  },
  {
    name: 'Dish Washing Liquid',
    description: 'Effective dish washing liquid with lemon fragrance',
    price: 99,
    category: 'household',
    brand: 'CleanHome',
    stock: 40,
    unit: 'bottle',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/dishwash.jpg',
        public_id: 'dishwash',
      },
    ],
  },
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@neenasupermarket.com',
  password: 'admin123',
  phone: '1234567890',
  role: 'admin',
};

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neena-supermarket', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await User.create({
      ...adminUser,
      password: hashedPassword,
    });

    // Create products
    await Product.insertMany(sampleProducts);

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
