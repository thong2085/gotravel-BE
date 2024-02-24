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
    // Tính tổng số vote từ rating của tất cả các review
    const totalVotes = await Review.aggregate([
      {
        $group: {
          _id: "$entityId", // Chỉ rõ trường entityId ở đây
          total: { $sum: "$rating" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" }, // Tính tổng tất cả các total của các entityId
        },
      },
    ]);

    // Lấy kết quả từ mảng totalVotes
    const result = totalVotes.length > 0 ? totalVotes[0].total : 0;

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
