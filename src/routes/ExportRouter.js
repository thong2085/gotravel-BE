const express = require("express");
const router = express.Router();
const ExportController = require("../controller/ExportController");
const { authMiddleware, authUserMiddleware } = require("../middleware/auth");

// Endpoint router cho việc xuất dữ liệu đặt lịch tour ra file Excel
router.get("/:id", authMiddleware, ExportController.exportToExcel);
router.get("/", authMiddleware, ExportController.exportAllToExcel);

module.exports = router;
