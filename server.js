require('dotenv').config();
const Counter = require('./counterModel');
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

const orderSchema = Joi.object({
  items: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required(),
  })).min(1).required(),
  totalPrice: Joi.number().min(0).required(),
  paymentMethod: Joi.string().valid('online', 'counter').required(),
});

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
  console.log("Raw req.body:", req.body); // Log the raw, unparsed body
    console.log("typeof req.body", typeof req.body); // Check the type
    try {
        console.log("Parsed req.body:", req.body); // Log after parsing
        const { error } = orderSchema.validate(req.body);
        if (error) {
            console.log("Joi Validation Error:", error.details); // Log detailed Joi errors
            return res.status(400).json({ message: error.details[0].message });
        }

      let counter = await Counter.findOne({ _id: 'orderCounter' });

      if (!counter) {
          // Find max order number in Orders collection
          const maxOrder = await Order.aggregate([
              { $group: { _id: null, maxOrderNumber: { $max: "$orderNumber" } } }
          ]);
          const initialOrderNumber = maxOrder.length > 0 ? maxOrder[0].maxOrderNumber + 1 : 1;

          counter = new Counter({ _id: 'orderCounter', orderNumber: initialOrderNumber });
          await counter.save();
      }

      const updatedCounter = await Counter.findOneAndUpdate(
          { _id: 'orderCounter' },
          { $inc: { orderNumber: 1 } },
          { new: true }
      );

      const newOrder = new Order({
        items: req.body.items,
        totalPrice: req.body.totalPrice,
        paymentMethod: req.body.paymentMethod,
        orderNumber: updatedCounter.orderNumber,
        orderStatus: 'new', 
      });
      
      

      await newOrder.save();
      const formattedOrderNumber = `ORD-${newOrder.orderNumber.toString().padStart(3, '0')}`;
      res.json({ success: true, orderNumber: formattedOrderNumber });

      pusher.trigger('order-channel', 'order-update', {
          orderNumber: formattedOrderNumber,
          status: 'new',
      });
  } catch (err) {
      console.error('Error placing order:', err);
      res.status(500).json({ message: 'Error placing order: ' + err.message });
  }
});

// Start server
const PORT = 5000;
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


// Update order status
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
      const { orderId } = req.params;
      const { status } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { $set: { orderStatus: status } },
          { new: true }
      );

      if (!updatedOrder) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Log before triggering to be sure
      console.log("Sending Pusher event for order:", updatedOrder._id, "Status:", updatedOrder.orderStatus);

      pusher.trigger('order-channel', 'order-update', {
          orderId: updatedOrder._id.toString(), // Send _id as a string (important!)
          orderStatus: updatedOrder.orderStatus,
          orderNumber: updatedOrder.orderNumber
      });

      res.json(updatedOrder);
  } catch (err) {
      console.error('Error updating order status:', err);
      res.status(500).json({ message: 'Error updating order status: ' + err.message });
  }
});