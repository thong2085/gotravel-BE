const express = require("express");
const router = express.Router();

const hotelController = require("../controller/HotelController");
const { authMiddleware, authUserMiddleware } = require("../middleware/auth");

router.post("/create-hotels", authMiddleware, hotelController.createHotel);
router.put("/update-hotels/:id", authMiddleware, hotelController.updateHotel);
router.delete(
  "/delete-hotels/:id",
  authMiddleware,
  hotelController.deleteHotel,
);
router.get("/get-hotels/:id", hotelController.getHotel);
router.get("/get-all-hotels", hotelController.getAllHotels);

router.post("/book-room/:id",  hotelController.bookRoom);
router.get(
  "/get-all-book-rooms",
  authMiddleware,
  hotelController.getAllBookRooms,
);

module.exports = router;
