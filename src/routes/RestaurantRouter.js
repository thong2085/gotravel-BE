const express = require("express");
const router = express.Router();

const restaurantController = require("../controller/RestaurantController");
const { authMiddleware, authUserMiddleware } = require("../middleware/auth");

router.post(
  "/create-restaurants",
  authMiddleware,
  restaurantController.createRestaurant,
);
router.put(
  "/update-restaurants/:id",
  authMiddleware,
  restaurantController.updateRestaurant,
);
router.delete(
  "/delete-restaurants/:id",
  authMiddleware,
  restaurantController.deleteRestaurant,
);
router.get("/get-restaurants/:id", restaurantController.getRestaurant);
router.get("/get-all-restaurants", restaurantController.getAllRestaurants);

router.post("/order-food", authUserMiddleware, restaurantController.orderFood);

module.exports = router;
