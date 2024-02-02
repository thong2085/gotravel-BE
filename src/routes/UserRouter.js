const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const { authMiddleware, authUserMiddleware } = require("../middleware/auth");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
router.get("/getAll", authMiddleware, userController.getAllUser);
router.get(
  "/get-details/:id",
  authUserMiddleware,
  userController.getDetailsUser
);
router.post("/refresh-token", userController.refreshToken);
router.post("/logout", userController.logout);

module.exports = router;
