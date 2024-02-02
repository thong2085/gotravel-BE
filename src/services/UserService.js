const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;

    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "The email is already",
        });
      }
      const hash = await bcrypt.hash(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        confirmPassword: hash,
        phone,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      const checkUser = await User.findOne({ email: email });
      if (!checkUser) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorrect",
        });
      }
      const access_token = await genneralAccessToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });

      const refresh_token = await genneralRefreshToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });
      resolve({
        status: "OK",
        message: "Đăng nhập thành công",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      console.log("checkUser", checkUser);
      if (!checkUser) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = async (id) => {
  try {
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      return {
        status: "error",
        message: "The user is not defined",
      };
    }

    await User.findByIdAndDelete(id);
    return {
      status: "success",
      message: "Delete user success",
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    };
  }
};

const getAllUser = async () => {
  try {
    const allUser = await User.find();
    return {
      status: "success",
      data: allUser,
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    };
  }
};

const getDetailsUser = async (id) => {
  try {
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      return {
        status: "error",
        message: "The user is not defined",
      };
    }

    return {
      status: "success",
      data: user,
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    };
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
};
