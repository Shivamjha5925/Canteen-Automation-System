// counterModel.js (create a new file)
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Use a string _id
    orderNumber: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;