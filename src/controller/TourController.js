const Tour = require("../models/TourModel");
const User = require("../models/UserModel");
const BookTour = require("../models/bookTourModel");

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
        tour: tour,
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

const bookTour = async (req, res) => {
  try {
    const { tourId, userId, tourName, userName, phoneNumber, email } = req.body;

    // Kiểm tra xem tour có tồn tại không
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Tạo một đối tượng mới từ model BookTour
    const newBookTour = new BookTour({
      tourId,
      userId,
      tourName: tour.name,
      userName,
      phoneNumber,
      email,
    });

    // Lưu đối tượng vào cơ sở dữ liệu
    await newBookTour.save();

    return res
      .status(200)
      .json({ message: "Booking successful", bookingDetails: newBookTour });
  } catch (error) {
    console.error("Error booking tour:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createTour,
  updateTour,
  deleteTour,
  getTour,
  getAllTours,
  bookTour,
};
