const Tour = require("../models/TourModel");
const BookTour = require("../models/bookTourModel");
const bookTourService = require("../services/bookTourService");

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
