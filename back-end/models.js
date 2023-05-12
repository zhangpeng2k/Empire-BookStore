const mongoose = require('mongoose');


// User Schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('users', UserSchema);


const CommentSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
  },
  text: {
      type: String,
      required: true,
  },
  createdAt: {
      type: Date,
      default: Date.now,
  },
});

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  publisher: String,
  ISBN: String,
  category: String,
  price: Number,
  comments: [CommentSchema],
});

const Book = mongoose.model('books', BookSchema);

// Order schema and model
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [
    {
      book: {
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        author: String,
        price: Number,
      },
      quantity: Number,
    },
  ],
  totalCost: Number,
  discountCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscountCode',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },status: {
    type: String,
    enum: ['pending', 'cancelled', 'completed'],
    default: 'pending',
  },
});

const Order = mongoose.model('orders', OrderSchema);


// Discount code schema and model
const DiscountCodeSchema = new mongoose.Schema({
  code: String,
  discountPercentage: Number,
});

const DiscountCode = mongoose.model('discount_codes', DiscountCodeSchema);

module.exports = {
  User,
  Book,
  Order,
  DiscountCode,
};