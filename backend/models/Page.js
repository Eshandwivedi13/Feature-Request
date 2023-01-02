const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxLength: 100,
      required: true,
      minLength: 5,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: 25,
      maxLength: 750,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
    photo: String,
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 160,
      trim: true,
    },
    //  photo: {
    //   data: Buffer,
    //   contentType: String,
    // },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Page", pageSchema);
