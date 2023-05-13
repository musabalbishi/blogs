const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: String,
  desc: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
    },
  ],
});

const Tag = mongoose.model("tag", tagSchema);
module.exports = Tag;
