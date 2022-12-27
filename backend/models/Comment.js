const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema(
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
    // CHANGEMENT 2ND MEthod ----
    feature: {
      type: ObjectId,
      ref: "Feature",
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
    // replies: [
    //   {
    //     content: {
    //       type: String,
    //       required: true,
    //       trim: true,
    //       max: 200,
    //     },
    //     postedBy: {
    //       type: ObjectId,
    //       ref: "User",
    //     },
    //     created: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //     votes: [
    //       {
    //         postedBy: {
    //           type: ObjectId,
    //           ref: "User",
    //         },
    //         created: {
    //           type: Date,
    //           default: Date.now,
    //         },
    //       },
    //     ],
    //   },
    // ],
    // edited: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);

// commentSchema.pre("find", function (next) {
//   if (this.options._recursed) {
//     return next();
//   }
//   this.populate({ path: "postedBy", options: { _recursed: true } });
//   next();
// });

// commentSchema.pre("find", function (next) {
//   this.populate({
//     path: "postedBy",
//     model: "User",
//   });
//   next();
// });

// {
//     content: {
//       type: String,
//       required: true,
//     },
//     //  tag: Object
//     likes: [
//       {
//         type: ObjectId,
//         ref: "User",
//         // required: true,
//       },
//     ],
//     reply: [
//       {
//         message: String,
//         createdBy: {
//           type: ObjectId,
//           ref: "User",
//         },
//         likes: [
//           {
//             type: ObjectId,
//             ref: "User",
//             required: true,
//           },
//         ],
//       },
//     ],
//     postedBy: {
//       type: ObjectId,
//       ref: "User",
//     },
//   }
