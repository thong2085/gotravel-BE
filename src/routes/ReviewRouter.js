const express = require("express");
const router = express.Router();
const reviewController = require("../controller/ReviewController");
const { authMiddleware, authUserMiddleware } = require("../middleware/auth");

// Thêm review mới
router.post("/:entityId", reviewController.addReview);

// Lấy danh sách reviews theo entity ID
router.get("/:entityId", reviewController.getReviewsByEntity);

module.exports = router;
