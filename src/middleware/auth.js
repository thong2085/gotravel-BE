const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const tokenHeader = req.headers.token;
  console.log(req.headers);
  if (!tokenHeader) {
    return res.status(401).json({
      status: "error",
      message: "Token invalid",
    });
  }
  const token = tokenHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};

const authUserMiddleware = (req, res, next) => {
  const tokenHeader = req.headers.token;
  console.log("tokenHeader", tokenHeader);
  if (!tokenHeader) {
    return res.status(401).json({
      status: "error",
      message: "Token không được cung cấp",
    });
  }
  const token = tokenHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      console.error("Lỗi xác thực token:", err);
      return res.status(404).json({
        message: "Token validation error",
        status: "ERROR",
      });
    }
    if (user?.isAdmin || user?.id) {
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};

const authenticateUser = (req, res, next) => {
  const tokenHeader = req.headers.token;
  if (!tokenHeader) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized - Token not provided",
    });
  }

  const token = tokenHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized - Invalid token",
      });
    }

    req.user = user; // Gán thông tin user vào req.user
    next();
  });
};
module.exports = {
  authMiddleware,
  authUserMiddleware,
  authenticateUser,
};
