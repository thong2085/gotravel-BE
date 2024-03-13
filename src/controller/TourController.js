const Tour = require("../models/TourModel");
const User = require("../models/UserModel");
const BookTour = require("../models/bookTourModel");
const bookTourService = require("../services/bookTourService");
const io = require("socket.io-client");
const Review = require("../models/ReviewModel");
const mongoose = require("mongoose");

const createTour = async (req, res) => {
  try {
    const { name, info, description, images, price } = req.body;

    const newTour = await Tour.create({
      name,
      info,
      description,
      images,
      price,
    });

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const updatedData = req.body;
    const updatedTour = await Tour.findByIdAndUpdate(tourId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTour) {
      return res.status(404).json({
        status: "error",
        message: "Tour not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const deletedTour = await Tour.findByIdAndDelete(tourId);

    if (!deletedTour) {
      return res.status(404).json({
        status: "error",
        message: "Tour not found",
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

const getTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const totalVotes = await Review.aggregate([
      {
        $match: {
          entityId: new mongoose.Types.ObjectId(tourId),
        },
      },
      {
        $group: {
          _id: "$entityId",
          totalRating: { $sum: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);
    let averageRating = 0;
    if (totalVotes.length > 0) {
      averageRating = totalVotes[0].totalRating / totalVotes[0].totalReviews;
    }
    if (!tourId) {
      return res.status(200).json({
        status: "ERR",
        message: "The tourId is required",
      });
    }
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        status: "error",
        message: "Tour not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tour: {
          ...tour.toObject(),
          totalVotes: Math.round(averageRating), // Trả về trung bình rating được làm tròn
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: "success",
      data: {
        tours: tours,
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
const bookTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const tour = await Tour.findById(tourId);
    const { tourName, userName, phoneNumber, email, text } = req.body;

    const countPrice = tour.price;

    const newBookTour = await BookTour.create({
      tourId,
      tourName,
      userName,
      phoneNumber,
      email,
      text,
      price: countPrice,
    });
    bookTourService;

    // Gửi thông báo
    const notificationData = {
      type: "bookTour",
      message: "New tour booking",
    };
    await sendNotification(notificationData);

    if (email || address || phoneNumber || text) {
      const response = await bookTourService(email);
      return res.status(201).json({
        status: "success",
        message: "BookTour successful",
        data: newBookTour,
        response,
      });
    }
  } catch (error) {
    console.error("Error booking tour:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllBookTours = async (req, res) => {
  try {
    const allBookTours = await BookTour.find();

    res.status(200).json({
      status: "success",
      data: {
        bookTours: allBookTours,
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
  createTour,
  updateTour,
  deleteTour,
  getTour,
  getAllTours,
  bookTour,
  getAllBookTours,
};
