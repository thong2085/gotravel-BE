const mongoose = require("mongoose");

const bookTourSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    tourName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const BookTour = mongoose.model("BookTour", bookTourSchema);

module.exports = BookTour;
