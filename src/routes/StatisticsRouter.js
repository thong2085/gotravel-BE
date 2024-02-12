const express = require("express");
const router = express.Router();

const statisticsController = require("../controller/StatisticController");
const { authMiddleware, authUserMiddleware } = require("../middleware/auth");

// Endpoint tính doanh thu hàng ngày
router.get("/daily", statisticsController.getDailyRevenue);

// Endpoint tính doanh thu hàng tuần
router.get("/weekly", statisticsController.getWeeklyRevenue);

// Endpoint tính doanh thu hàng tháng
router.get("/monthly", statisticsController.getMonthlyRevenue);
module.exports = router;
