const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNum: { type: String, required: true, unique: true },
  availableAmount: { type: Number, default: 0 },
  transactions: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
      amount: { type: Number, required: true },
      cashback: { type: Number, default: 0 },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
