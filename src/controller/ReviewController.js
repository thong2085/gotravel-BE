const mongoose = require("mongoose");
const Review = require("../models/ReviewModel");

// Thêm review mới
const addReview = async (req, res) => {
  try {
    const { userId, entityType, rating, comment } = req.body;
    const entityId = req.params.entityId;

    const newReview = new Review({
      userId,
      entityId,
      entityType,
      rating,
      comment,
    });
    await newReview.save();

    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getReviewsByEntity = async (req, res) => {
  try {
    const entityId = req.params.entityId;
    const page = parseInt(req.query.page) || 1; // Trang mặc định là 1
    const limit = parseInt(req.query.limit) || 10; // Giới hạn số lượng kết quả trả về mặc định là 10

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const reviews = await Review.find({ entityId })
      .skip(startIndex)
      .limit(limit)
      .populate("userId");

    res.status(200).json({
      status: "success",
      data: {
        reviews,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getTotalVotes = async (req, res) => {
  try {
    const entityId = new mongoose.Types.ObjectId(req.params.id);

    // Tính tổng số vote và số lượng đánh giá từ rating của tất cả các review có entityId bằng req.params.id
    const totalVotes = await Review.aggregate([
      {
        $match: {
          entityId: entityId, // Sử dụng entityId như làm biến để so khớp với req.params.id
        },
      },
      {
        $group: {
          _id: "$entityId", // Chỉ rõ trường entityId ở đây
          totalRating: { $sum: "$rating" },
          totalReviews: { $sum: 1 }, // Đếm số lượng đánh giá
        },
      },
    ]);

    // Lấy kết quả từ mảng totalVotes và tính tổng số vote chia cho số lượng đánh giá
    let result = 0;
    if (totalVotes.length > 0) {
      const averageRating =
        totalVotes[0].totalRating / totalVotes[0].totalReviews;
      result = Math.round(averageRating);
    }

    res.json({ totalVotes: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getReviewsByEntity,
  getTotalVotes,
};
