const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: [50, 'Customer name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxLength: [50, 'Email cannot exceed 50 characters']
  },
  issue: {
    type: String,
    required: true,
    enum: [
      'Order Issues',
      'Payment Issues',
      'Shipping Issues',
      'Product Issues',
      'Returns/Refunds Issues',
      'Website Navigation and Usability Issues',
      'Security and Privacy Issues',
      'Other Issues'
    ]
  },
  description: {
    type: String,
    maxLength: [100, 'Description cannot exceed 100 characters']
  },
  status: {
    type: String,
    required: true,
    default: 'Ongoing'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    message: String,
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
