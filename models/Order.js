const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: Number, required: true, unique: true },  // Add orderNumber
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['online', 'counter'], default: 'counter' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  orderStatus: { type: String, enum: ['new', 'in-progress', 'completed'], default: 'new' },
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
