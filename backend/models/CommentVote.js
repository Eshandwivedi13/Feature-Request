const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentVoteSchema = new mongoose.Schema(
  {
    comment: {
      type: ObjectId,
      ref: "Comment",
      required: true,
      // postedBy: {
      //   type: ObjectId,
      //   ref: "User",
      // },
    },
    votes: [
      {
        postedBy: {
          type: ObjectId,
          ref: "User",
        },

        created: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommentVote", commentVoteSchema);
