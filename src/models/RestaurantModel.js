const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  address: String,
  info: String,
  menu: [
    {
      comboFood: String,
      price: Number,
    },
  ],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
