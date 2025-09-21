const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['earned', 'redeemed'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  source: String, // e.g., 'signup', 'contest_win', 'manual_reward'
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
