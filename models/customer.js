const mongoose = require('mongoose');

// Define customer schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true }
});

// Compile the schema into a model
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;