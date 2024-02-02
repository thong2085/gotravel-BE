const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  classify: {
    type: String,
    required: true,
  },

  address: String,
  info: String,
  roomCount: {
    type: Number,
    default: 0,
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
