const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  info: String,
  description: String,
  images: [
    {
      type: String,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
