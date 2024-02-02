const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  restaurantName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  address: String,
  phoneNumber: String,
  email: String,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
