const mongoose = require('mongoose');
const Plan = require('../models/Plan');
const User = require('../models/User');
require('dotenv').config();

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Plan.deleteMany({});

    const plans = [
      {
        name: 'Basic',
        price: 8.99,
        currency: 'USD',
        features: [
          'Watch on 1 device at a time',
          'Unlimited movies and TV shows',
          'Cancel anytime'
        ],
        videoQuality: '480p',
        simultaneousScreens: 1,
        stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
        active: true,
        billingCycle: 'monthly',
        downloadAllowed: false
      },
      {
        name: 'Standard',
        price: 12.99,
        currency: 'USD',
        features: [
          'Watch on 2 devices at a time',
          'HD available',
          'Unlimited movies and TV shows',
          'Cancel anytime'
        ],
        videoQuality: '1080p',
        simultaneousScreens: 2,
        stripePriceId: process.env.STRIPE_STANDARD_PRICE_ID || 'price_standard',
        active: true,
        billingCycle: 'monthly',
        downloadAllowed: true
      },
      {
        name: 'Premium',
        price: 17.99,
        currency: 'USD',
        features: [
          'Watch on 4 devices at a time',
          'Ultra HD available',
          'Unlimited movies and TV shows',
          'Cancel anytime'
        ],
        videoQuality: '4K',
        simultaneousScreens: 4,
        stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium',
        active: true,
        billingCycle: 'monthly',
        downloadAllowed: true
      }
    ];

    await Plan.insertMany(plans);
    console.log('Plans seeded successfully');

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@streamflix.com',
        password: 'admin123',
        role: 'admin',
        subscriptionStatus: 'active',
        isActive: true
      });
      console.log('Admin user created: admin@streamflix.com / admin123');
    }

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedPlans();
