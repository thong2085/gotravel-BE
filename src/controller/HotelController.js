const Hotel = require("../models/HotelModel");
const BookRoom = require("../models/BookRoomModel");
const nodemailer = require("nodemailer");

const createHotel = async (req, res) => {
  try {
    const { name, images, classify, address, info, roomCount } = req.body;

    const newHotel = await Hotel.create({
      name,
      images,
      classify,
      address,
      info,
      roomCount,
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

const bookRoom = async (req, res) => {
  try {
    // Lấy dữ liệu từ request body
    const {
      hotelId,
      hotelName,
      userId,
      userName,
      address,
      phoneNumber,
      email,
      numberOfRooms,
      bookingDays,
    } = req.body;

    // Tạo một đối tượng BookRoom mới
    const booking = new BookRoom({
      hotelId,
      hotelName,
      userId,
      userName,
      address,
      phoneNumber,
      email,
      numberOfRooms,
      bookingDays,
    });

    // Lưu đối tượng vào cơ sở dữ liệu
    const result = await booking.save();

    // Trả về kết qu.name,
    res.status(201).json({
      status: "success",
      message: "Booking successful",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
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
};
