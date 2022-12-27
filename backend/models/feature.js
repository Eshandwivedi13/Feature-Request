const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 25,
      maxLength: 400,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 125,
      trim: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    page: {
      type: ObjectId,
      ref: "Page",
      required: true,
    },
    // comments: [
    //   {
    //     type: ObjectId,
    //     ref: "Comment",
    //   },
    // ],
    // likes: [{ type: ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Feature", featureSchema);
