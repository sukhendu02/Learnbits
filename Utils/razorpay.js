const Razorpay = require("razorpay");

const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
  key_id: "rzp_test_8MNWS3gnmoiTct",
  key_secret: "5JeokCuRpw1bwvburx0gcRyh",
});

module.exports = razorpay;
