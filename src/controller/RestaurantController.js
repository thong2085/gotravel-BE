const Order = require("../models/OrderModel");
const Restaurant = require("../models/RestaurantModel");
const User = require("../models/UserModel");
const oderFoodService = require("../services/oderFoodService");
const io = require("socket.io-client");
const Review = require("../models/ReviewModel");
const mongoose = require("mongoose");

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
    const totalVotes = await Review.aggregate([
      {
        $match: {
          entityId: new mongoose.Types.ObjectId(restaurantId),
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
        restaurant: {
          ...restaurant.toObject(),
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

const orderFood = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    const { restaurantName, address, userName, phoneNumber, email, text } =
      req.body;

    let countPrice = 0;

    for (const menuItem of restaurant.menu) {
      countPrice += menuItem.price;
    }
    const newOrder = await Order.create({
      restaurantId,
      restaurantName,
      address,
      userName,
      phoneNumber,
      email,
      text,
      price: countPrice,
    });
    // Gửi thông báo
    const notificationData = {
      type: "orderFood",
      message: "New restaurant booking",
    };
    await sendNotification(notificationData);
    if (email || address || phoneNumber || text) {
      const response = await oderFoodService(email);
      return res.status(201).json({
        status: "success",
        message: "Oder successful",
        data: newOrder,
        response,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const allOrderFoods = await Order.find();

    res.status(200).json({
      status: "success",
      data: {
        orderFoods: allOrderFoods,
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
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurant,
  getAllRestaurants,
  orderFood,
  getAllOrders,
};
