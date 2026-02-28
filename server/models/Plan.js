const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    enum: ['Basic', 'Standard', 'Premium'],
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  features: [{
    type: String
  }],
  videoQuality: {
    type: String,
    enum: ['480p', '720p', '1080p', '4K'],
    required: true
  },
  simultaneousScreens: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  stripePriceId: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  downloadAllowed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);
