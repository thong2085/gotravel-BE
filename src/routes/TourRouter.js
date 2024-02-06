const express = require("express");
const router = express.Router();

const tourController = require("../controller/TourController");
const { authMiddleware, authUserMiddleware } = require("../middleware/auth");

router.post("/create-tours", authMiddleware, tourController.createTour);
router.put("/update-tours/:id", authMiddleware, tourController.updateTour);
router.delete("/delete-tours/:id", authMiddleware, tourController.deleteTour);
router.get("/get-tours/:id", tourController.getTour);
router.get("/get-all-tours", tourController.getAllTours);

router.post("/book-tour/:id", authUserMiddleware, tourController.bookTour);

module.exports = router;
