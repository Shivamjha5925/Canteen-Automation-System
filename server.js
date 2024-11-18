require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Pusher = require('pusher');
const Joi = require('joi');

const app = express();

// Pusher setup
const pusher = new Pusher({
  appId: '1897784',
  key: 'af1de85d6af0f9f6dae9',
  secret: 'fde67e6b9c74678cda4b',
  cluster: 'ap2',
  useTLS: true,
});

// Middleware
app.use(cors());
app.use(express.static('images'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

// Routes

// Test route
app.get('/', (req, res) => res.send('Canteen Automation System is running!'));

// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
});


// Create an order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod } = req.body;

    // Fetch the last order and determine the new order number
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const newOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

    // Create a new order
    const newOrder = new Order({
      items,
      totalPrice,
      paymentMethod,
      orderNumber: newOrderNumber, // Store as a number
    });

    await newOrder.save();

    // Format the order number for response or events
    const formattedOrderNumber = `ORD-${newOrderNumber.toString().padStart(3, '0')}`;
    res.json({ orderNumber: formattedOrderNumber });

    // Trigger Pusher event with the formatted order number
    pusher.trigger('order-channel', 'order-update', {
      orderNumber: formattedOrderNumber,
      status: 'new',
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Error placing order' });
  }
});


// Update order status
app.put('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'in-progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    pusher.trigger('order-channel', 'order-update', {
      orderNumber: updatedOrder.orderNumber,
      status: updatedOrder.orderStatus,
    });

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Start server
//const PORT = 5000;
// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();  // Fetch all orders from the database
    res.json(orders);  // Send the orders as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders' });
  }
});

//app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
