const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const featurevoteSchema = new mongoose.Schema(
  {
    feature: {
      type: ObjectId,
      ref: "Comment",
      required: true,
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

module.exports = mongoose.model("FeatureVote", featurevoteSchema);
