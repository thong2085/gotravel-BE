const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu tới mô hình User
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    entityType: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: String,
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
