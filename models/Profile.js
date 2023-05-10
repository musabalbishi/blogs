const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    bio: String,
    workExp: String,
    connectedUser: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("profile", profileSchema);

module.exports = { Profile, profileSchema };
