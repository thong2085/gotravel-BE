const Order = require("../models/OrderModel");
const Restaurant = require("../models/RestaurantModel");

const createRestaurant = async (req, res) => {
  try {
    const { name, images, address, info, menu } = req.body;

    const newRestaurant = await Restaurant.create({
      name,
      images,
      address,
      info,
      menu,
    });

    res.status(201).json({
      status: "success",
      data: {
        restaurant: newRestaurant,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found",
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

const updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const updatedData = req.body;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedRestaurant) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        restaurant: updatedRestaurant,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.status(200).json({
      status: "success",
      data: {
        restaurants: restaurants,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const orderFood = async (req, res) => {
  try {
    const {
      restaurantId,
      userId,
      restaurantName,
      address,
      userName,
      phoneNumber,
      email,
    } = req.body;

    const newOrder = new Order({
      restaurantId,
      userId,
      restaurantName,
      address,
      userName,
      phoneNumber,
      email,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurant,
  getAllRestaurants,
  orderFood,
};
