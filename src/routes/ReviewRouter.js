const express = require("express");
const router = express.Router();
const reviewController = require("../controller/ReviewController");
const { authMiddleware, authUserMiddleware } = require("../middleware/auth");

// Thêm review mới
router.post("/add/:entityId", reviewController.addReview);

// Lấy danh sách reviews theo entity ID
router.get("/:entityId", reviewController.getReviewsByEntity);

router.get("/total-votes/:id", reviewController.getTotalVotes);

module.exports = router;
