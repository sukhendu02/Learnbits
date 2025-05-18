// utils/reward.js
// const user = require('../models/user');
const transaction = require('../modals/transaction');
const user = require("../modals/user")

const rewardUser = async (userId, amount, description, source = 'manual_reward') => {
  const rewardUser = await user.findById(userId);
  if (!rewardUser) throw new Error('User not found');

  rewardUser.coins += amount;
  await rewardUser.save();

  await transaction.create({
    user: rewardUser._id,
    type: 'earned',
    amount,
    description,
    source
  });

  return rewardUser.coins;
};


const redeemCoins = async (userId, amount, description) => {
  const rewardUser = await user.findById(userId);
  if (!rewardUser || rewardUser.coins < amount) throw new Error('Not enough coins');

  rewardUser.coins -= amount;
  await rewardUser.save();

  await transaction.create({
    user: rewardUser._id,
    type: 'redeemed',
    amount,
    description,
    source: 'redeem'
  });

  return rewardUser.coins;
};


module.exports = { rewardUser,redeemCoins };
