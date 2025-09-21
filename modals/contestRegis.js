
const mongoose = require('mongoose');
const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contest: { type: mongoose.Schema.Types.ObjectId, ref: "Contest" },
  paymentId: String,
  amountPaid: Number,
  status: { type: String, default: "success" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Registration", registrationSchema);
