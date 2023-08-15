const { text } = require('body-parser');
const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  subheading: {
    type: String,
    // required: true,
  },
  contest_type: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  schedule: {
    type: String,
    enum: ['weekly', 'monthly'],
    // required: true,
  },
  reg_startDate: {
    type: Date,
    // required: true,
  },
  reg_endDate: {
    type: Date,
    // required: true,
  },
  contest_startDate: {
    type: Date,
    // required: true,
  },
  contest_endDate: {
    type: Date,
    // required: true,
  },
  slots: {
    type: Number,
    // required: true,
  },
  total_winners: {
    type: Number,
    // required: true,
  },
  eligiblity: {
    type: String,
    // required: true,
  },
  guidelines: {
    type: String,
    // required: true,
  },
  img: {
    type: String,
    // required: true,
  },
  participants: [{
    // type: mongoose.Schema,
    // ref: 'User',
  }],
  // winners: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   // ref: 'User',
  // }],
  winners: {
    type: String,
    // ref: 'User',
  },
  prize: [{ }],
 
  isActive: {
    type: Boolean,
    default: true,
  },
  date:{type:Date,default:Date.now}
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
