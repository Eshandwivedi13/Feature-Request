const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentReplyVoteSchema = new mongoose.Schema(
  {
    commentReply: {
      type: ObjectId,
      ref: "CommentReply",
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

module.exports = mongoose.model("CommentReplyVote", commentReplyVoteSchema);
