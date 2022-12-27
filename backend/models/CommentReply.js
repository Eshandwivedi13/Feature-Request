const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentReplySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: ObjectId,
      ref: "Comment",
      required: true,
    },
    // votes: [
    //   {
    //     postedBy: {
    //       type: ObjectId,
    //       ref: "User",
    //     },
    //     created: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("CommentReply", commentReplySchema);
