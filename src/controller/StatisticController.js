const BookTour = require("../models/bookTourModel");
const BookRoom = require("../models/bookRoomModel");
const OrderFood = require("../models/OrderModel");

const getDailyRevenue = async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const tourRevenue = await BookTour.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "Ngày %d", date: "$createdAt" } },
          totalRevenue: { $sum: "$price" },
          tourNames: { $addToSet: "$tourName" },
          userNames: { $addToSet: "$userName" },
        },
      },
    ]);

    const roomRevenue = await BookRoom.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "Ngày %d", date: "$createdAt" } },
          totalRevenue: { $sum: "$price" },
          tourNames: { $addToSet: "$tourName" },
          userNames: { $addToSet: "$userName" },
        },
      },
    ]);

    const foodRevenue = await OrderFood.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "Ngày %d", date: "$createdAt" } },
          totalRevenue: { $sum: "$price" },
          tourNames: { $addToSet: "$tourName" },
          userNames: { $addToSet: "$userName" },
        },
      },
    ]);

    const dailyRevenue = {
      tourRevenue: {
        totalRevenue: tourRevenue.length ? tourRevenue[0].totalRevenue : 0,
        _id: tourRevenue.length ? tourRevenue[0]._id : [],
        tourName: tourRevenue.length ? tourRevenue[0].tourNames : [""],
        userNames: tourRevenue.length ? tourRevenue[0].userNames : [""],
      },
      roomRevenue: {
        totalRevenue: roomRevenue.length ? roomRevenue[0].totalRevenue : 0,
        _id: roomRevenue.length ? roomRevenue[0]._id : [],
        hotelNames: roomRevenue.length ? roomRevenue[0].hotelNames : [""],
        userNames: roomRevenue.length ? roomRevenue[0].userNames : [""],
      },
      foodRevenue: {
        totalRevenue: foodRevenue.length ? foodRevenue[0].totalRevenue : 0,
        _id: foodRevenue.length ? foodRevenue[0]._id : [],
        restaurantNames: foodRevenue.length ? foodRevenue[0].userNames : [""],
        userNames: foodRevenue.length ? foodRevenue[0].userNames : [""],
      },
    };

    res.status(201).json({
      status: "success",
      data: {
        dailyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWeeklyRevenue = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
    endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));

    const tourRevenue = await BookTour.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalRevenue: { $sum: "$price" },
          tourNames: { $addToSet: "$tourName" },
          userNames: { $addToSet: "$userName" },
        },
      },
    ]);

    const roomRevenue = await BookRoom.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalRevenue: { $sum: "$price" },
          hotelNames: { $addToSet: "$hotelName" },
          userNames: { $addToSet: "$userName" },
        },
      },
    ]);

    const foodRevenue = await OrderFood.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalRevenue: { $sum: "$price" },
          restaurantNames: { $addToSet: "$restaurantName" },
          userNames: { $addToSet: "$userName" },
        },
      },
    ]);
    // Tính tổng doanh thu của tất cả các ngày trong mỗi loại dịch vụ
    const totalTourRevenue = tourRevenue.reduce(
      (total, current) => total + current.totalRevenue,
      0,
    );
    const totalRoomRevenue = roomRevenue.reduce(
      (total, current) => total + current.totalRevenue,
      0,
    );
    const totalFoodRevenue = foodRevenue.reduce(
      (total, current) => total + current.totalRevenue,
      0,
    );
    const weeklyRevenue = {
      tourRevenue: {
        totalTourRevenue,
        _id: tourRevenue.length ? tourRevenue[0]._id : [],
        tourName: tourRevenue.length ? tourRevenue[0].tourNames : [""],
        userNames: tourRevenue.length ? tourRevenue[0].userNames : [""],
      },
      roomRevenue: {
        totalRoomRevenue,
        _id: roomRevenue.length ? roomRevenue[0]._id : [],
        hotelNames: roomRevenue.length ? roomRevenue[0].hotelNames : [""],
        userNames: roomRevenue.length ? roomRevenue[0].userNames : [""],
      },
      foodRevenue: {
        totalFoodRevenue,
        _id: foodRevenue.length ? foodRevenue[0]._id : [],
        restaurantNames: foodRevenue.length ? foodRevenue[0].userNames : [""],
        userNames: foodRevenue.length ? foodRevenue[0].userNames : [""],
      },
    };

    res.status(201).json({
      status: "success",
      data: {
        weeklyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Đặt ngày đầu tiên của tháng
    startDate.setDate(1);
    // Đặt ngày cuối cùng của tháng
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    const tourRevenue = await BookTour.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalRevenue: { $sum: "$price" },
          tourNames: { $addToSet: "$tourName" },
          userNames: { $addToSet: "$userName" },
        },
      },
    ]);

    const roomRevenue = await BookRoom.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalRevenue: { $sum: "$price" },
          hotelNames: { $addToSet: "$hotelName" },
          userNames: { $addToSet: "$userName" },
        },
      },
    ]);

    const foodRevenue = await OrderFood.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalRevenue: { $sum: "$price" },
          restaurantNames: { $addToSet: "$restaurantName" },
          userNames: { $addToSet: "$userName" },
        },
      },
    ]);
    const totalTourRevenue = tourRevenue.reduce(
      (total, current) => total + current.totalRevenue,
      0,
    );
    const totalRoomRevenue = roomRevenue.reduce(
      (total, current) => total + current.totalRevenue,
      0,
    );
    const totalFoodRevenue = foodRevenue.reduce(
      (total, current) => total + current.totalRevenue,
      0,
    );
    const monthlyRevenue = {
      tourRevenue: {
        totalTourRevenue,
        _id: tourRevenue.length ? tourRevenue[0]._id : [],
        tourName: tourRevenue.length ? tourRevenue[0].tourNames : [""],
        userNames: tourRevenue.length ? tourRevenue[0].userNames : [""],
      },
      roomRevenue: {
        totalRoomRevenue,
        _id: roomRevenue.length ? roomRevenue[0]._id : [],
        hotelNames: roomRevenue.length ? roomRevenue[0].hotelNames : [""],
        userNames: roomRevenue.length ? roomRevenue[0].userNames : [""],
      },
      foodRevenue: {
        totalFoodRevenue,
        _id: foodRevenue.length ? foodRevenue[0]._id : [],
        restaurantNames: foodRevenue.length ? foodRevenue[0].userNames : [""],
        userNames: foodRevenue.length ? foodRevenue[0].userNames : [""],
      },
    };

    res.status(201).json({
      status: "success",
      data: {
        monthlyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDailyRevenue, getWeeklyRevenue, getMonthlyRevenue };
