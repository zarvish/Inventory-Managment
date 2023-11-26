// models/Item.js
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    received_date: {
      type: Date,
      required: true,
    },
    dispatched_date: {
      type: Date,
    },
  },
  quantity: {
    received_quantity: {
      type: Number,
      required: true,
    },
    dispatched_quantity: {
      type: Number,
    },
  },
});

module.exports = mongoose.model("Inventory", inventorySchema);
