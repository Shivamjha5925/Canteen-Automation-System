const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: { type: String, required: true }, // Add the image field for the item's image URL
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
