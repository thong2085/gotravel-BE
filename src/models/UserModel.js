const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    bookedTours: [{
      tourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    }],
    access_token: {
      type: String,
      require: true,
    },
    refresh_token: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
