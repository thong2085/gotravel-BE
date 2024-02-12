const mongoose = require("mongoose");

const bookRoomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    address: {
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
    numberOfRooms: {
      type: Number,
      required: true,
    },
    bookingDays: {
      type: Number,
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

const BookRoom = mongoose.model("BookRoom", bookRoomSchema);

module.exports = BookRoom;
