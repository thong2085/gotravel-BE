const User = require("../models/UserModel");
const Hotel = require("../models/HotelModel");
const BookRoom = require("../models/bookRoomModel");
const bookRoomService = require("../services/bookRoomService");
const io = require("socket.io-client");

const createHotel = async (req, res) => {
  try {
    const { name, images, classify, address, info, roomCount, price } =
      req.body;

    const newHotel = await Hotel.create({
      name,
      images,
      classify,
      address,
      info,
      roomCount,
      price,
    });

    res.status(201).json({
      status: "success",
      data: {
        hotel: newHotel,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;

    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

    if (!deletedHotel) {
      return res.status(404).json({
        status: "error",
        message: "Hotel not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const updateHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const updatedData = req.body;

    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHotel) {
      return res.status(404).json({
        status: "error",
        message: "Hotel not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        hotel: updatedHotel,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

const getHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        status: "error",
        message: "Hotel not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        hotel: hotel,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();

    res.status(200).json({
      status: "success",
      data: {
        hotels: hotels,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const sendNotification = async (notificationData) => {
  // Kết nối đến server websocket
  const socket = io("http://localhost:3000");

  const user = await User.find();

  // Gửi thông báo qua websocket
  if (user?.isAdmin) {
    socket.emit("notification", notificationData);
  }

  // Đóng kết nối websocket
  socket.close();
};

const bookRoom = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);

    const {
      hotelName,
      userName,
      address,
      phoneNumber,
      email,
      numberOfRooms,
      bookingDays,
      text,
      price,
    } = req.body;

    const countPrice = hotel.price * numberOfRooms * bookingDays;

    const newBooking = await BookRoom.create({
      hotelId,
      hotelName,
      userName,
      address,
      phoneNumber,
      email,
      numberOfRooms,
      bookingDays,
      text,
      price: countPrice,
    });
    // Gửi thông báo
    const notificationData = {
      type: "bookRoom",
      message: "New hotel booking",
    };
    await sendNotification(notificationData);
    if (
      email ||
      address ||
      phoneNumber ||
      numberOfRooms ||
      bookingDays ||
      text
    ) {
      const response = await bookRoomService(email);

      return res.status(201).json({
        status: "success",
        message: "Booking successful",
        data: newBooking,
        response,
      });
    }
  } catch (error) {
    console.error("BookRoom Failed:", error);
  }
};

const getAllBookRooms = async (req, res) => {
  try {
    const allBookRooms = await BookRoom.find();

    res.status(200).json({
      status: "success",
      data: {
        bookRooms: allBookRooms,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotel,
  getAllHotels,
  bookRoom,
  getAllBookRooms,
};
