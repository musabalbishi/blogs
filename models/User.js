const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    role: String,
    userProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
