const UserRouter = require("./UserRouter");
const TourRouter = require("./TourRouter");
const HotelRouter = require("./HotelRouter");
const RestaurantRouter = require("./RestaurantRouter");
const ReviewRouter = require("./ReviewRouter");
const StatisticsRouter = require("./StatisticsRouter");
const ExportRouter = require("./ExportRouter");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/tour", TourRouter);
  app.use("/api/hotel", HotelRouter);
  app.use("/api/restaurant", RestaurantRouter);
  app.use("/api/review", ReviewRouter);
  app.use("/api/statistics", StatisticsRouter);
  app.use("/api/export", ExportRouter);
};

module.exports = routes;
