const User = require('../models/User');
const { handleCashback } = require('../utils');

module.exports = {
  async login(req, res) {
    try {
      const { phoneNum, initialAmount } = req.body;

      if (!phoneNum) {
        return res.status(400).json({ error: 'Phone number is required.' });
      }

      let user = await User.findOne({ phoneNum : phoneNum });

      if (!user) {
        user = new User({ phoneNum: phoneNum, availableAmount: initialAmount });
        await user.save();
      } else {
        user.availableAmount = initialAmount + user.availableAmount
        await user.save()
      }


      return res.json({ message: 'Login successful', user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async transfer(req, res) {
    try {
      const { from, to, amount } = req.body;

      if (!from || !to || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid input data.' });
      }

      const sender = await User.findOne({ phoneNum: from });
      const recipient = await User.findOne({ phoneNum: to });

      if (!sender || !recipient) {
        return res.status(404).json({ error: 'Sender or recipient not found.' });
      }

      if (sender.availableAmount < amount) {
        return res.status(403).json({ error: 'Insufficient balance.' });
      }

      sender.availableAmount -= amount;
      await sender.save();

      recipient.availableAmount += amount;
      await recipient.save();

      const cashbackAmount = handleCashback(amount);
      recipient.availableAmount += cashbackAmount;

      // Update transactions
      sender.transactions.push({
        from: sender.phoneNum,
        to: recipient.phoneNum,
        amount: -amount,
        cashback: -cashbackAmount,
      });
      recipient.transactions.push({
        from: sender.phoneNum,
        to: recipient.phoneNum,
        amount,
        cashback: cashbackAmount,
      });

      await sender.save();
      await recipient.save();

      return res.json({
        message: 'Transfer successful',
        sender: { phoneNum: sender.phoneNum, availableAmount: sender.availableAmount },
        recipient: { phoneNum: recipient.phoneNum, availableAmount: recipient.availableAmount },
        cashback: cashbackAmount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async getUserTransactions(req, res) {
    try {
      const { phoneNum } = req.params;

      const user = await User.findOne({ phoneNum });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.json({ transactions: user.transactions });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};


