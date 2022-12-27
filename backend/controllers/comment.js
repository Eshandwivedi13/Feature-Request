// const User = require("../models/user");
const Feature = require("../models/feature");
const Comment = require("../models/Comment");
const { errorHandler } = require("../helpers");
const _ = require("lodash");
const CommentVote = require("../models/CommentVote");
const CommentReply = require("../models/CommentReply");
const CommentReplyVote = require("../models/CommentReplyVote");

// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;
var ObjectId = require("mongoose").Types.ObjectId;

// exports.createComment = (req, res) => {
//   const { featureId } = req.params;
//   const { content } = req.body;
//   const { postedBy } = req.auth._id;
//   if (!content) {
//     return res
//       .status(400)
//       .send({ error: "Please provide a content with your comment." });
//   }
//   Feature.findById({ featureId }).exec((err, feature) => {
//     if (err) {
//       return res.status(400).json({
//         error: errorHandler(err),
//       });
//     }
//     const featureID = feature._id;
//     const comment = new Comment({
//       content,
//       postedBy,
//       featureID,
//     });
//     console.log("YE HAi", comment);
//     comment.save();
//     res.status(201).send({
//       ...comment.toObject(),
//       postedBy: {
//         username: user.username,
//         avatar: user.avatar,
//       },
//       votes: 0,
//       replies: 0,
//     });
//   });

//   //   const comment = new Comment({
//   //     content,
//   //     postedBy,
//   //   });
//   //   Feature.findByIdAndUpdate(
//   //     { _id: featureId },
//   //     {
//   //       $push: { comments: comment },
//   //     },
//   //     { new: true }
//   //   ).exec((err, data) => {
//   //     if (err) {
//   //       console.log("test");
//   //     }
//   //     if (data) {
//   //       console.log("best");
//   //     }
//   //   });
// };

// by me

// module.exports.createComment = async (req, res, next) => {
// BY ME---
//   const { featureId } = req.params;
//   const { content } = req.body;
//   const user = req.auth;
//   if (!content) {
//     return res
//       .status(400)
//       .send({ error: "Please provide a content with your comment." });
//   }
//   if (!featureId) {
//     return res.status(400).send({
//       error:
//         "Please provide the id of the Feature you would like to comment on.",
//     });
//   }
//   if (content.length > 200)
//     return res
//       .status(400)
//       .json({ error: "content should be less than 200 characters" });
//   try {
//     const feature = await Feature.findById(featureId);
//     if (!feature) {
//       return res.status(404).send({
//         error: "Could not find a feature with that featureId",
//       });
//     }
//     const comment = new Comment({
//       content,
//       postedBy: user._id,
//       feature: featureId,
//     });
//     console.log("ye hai", comment);
//     await comment.save();
//     return res.status(201).json(comment);
//     //   postedBy: {
//     //     _id: user._id,
//     //     username: user.username,
//     //     avatar: user.avatar,
//     //     verified: user.verified,
//     //   },
//     //   votes: 0,
//     //   replies: 0,
//     //   isLiked: false,
//     // });
//   } catch (err) {
//     next(err);
//   }
// };

exports.createComment = async (req, res) => {
  try {
    const { featureId } = req.params;
    const { content } = req.body;
    const postedBy = req.auth._id;
    if (!content) {
      return res
        .status(400)
        .send({ error: "Please provide a content with your comment." });
    }
    const comment = new Comment({
      content,
      postedBy,
      feature: featureId,
    });

    await comment.save();
    const commentId = comment._id;
    console.log(commentId);
    const commentVote = new CommentVote({
      comment: commentId,
    });
    commentVote.save();
    console.log("?");
    // console.log("c", comment.createdAt);
    // comment.sort({ createdAt: -1 });
    return res.json(comment);
  } catch (error) {
    console.log(error);
  }
};

// exports.createComment = async (req, res) => {
//   console.log("run?");
//   const { featureId } = req.params;
//   const { content } = req.body;
//   const postedBy = req.auth._id;
//   if (!content) {
//     return res
//       .status(400)
//       .send({ error: "Please provide a content with your comment." });
//   }
//   const comment = new Comment({
//     content,
//     postedBy,
//   });
//   await comment.save();
//   console.log("C", comment);
//   let populatedData = await Comment.findById(comment._id).populate(
//     "postedBy",
//     "_id username"
//   );
//   Feature.findByIdAndUpdate(
//     featureId,
//     { $push: { comments: comment._id } },
//     { new: true }
//   ).exec((err, result) => {
//     if (err) {
//       return res.json({
//         error: errorHandler(err),
//       });
//     }
//   });
//   return res.json(populatedData);
// };
// YE THA MAIN CREATE WALA -
// exports.createComment = (req, res) => {
//   console.log("chala?");
//   const { featureId } = req.params;
//   const { content } = req.body;
//   const postedBy = req.auth._id;
//   if (!content) {
//     return res
//       .status(400)
//       .send({ error: "Please provide a content with your comment." });
//   }
//   const comment = new Comment({
//     content,
//     postedBy,
//   });
//   comment.save((err, result) => {
//     if (err) {
//       return res.status(400).json({
//         error: errorHandler(err),
//       });
//     }
//     console.log("commen");
//     // youtuber method
//     // Feature.findById({ _id: featureId }).exec((err, feature) => {
//     //   if (err) {
//     //     return res.json({
//     //       error: errorHandler(err),
//     //     });
//     //   } else {
//     //     feature.comments.push(result);
//     //     console.log(feature);
//     //     feature.save();
//     //   }
//     //   console.log("hey");
//     // });

//     //guruji method-
//     Feature.findByIdAndUpdate(
//       featureId,
//       { $push: { comments: result._id } },
//       { new: true }
//     )
//       // .populate({
//       //   path: "comments",
//       //   populate: {
//       //     path: "postedBy",
//       //     select: "_id username",
//       //   },
//       // })
//       .exec((err, result) => {
//         if (err) {
//           return res.json({
//             error: errorHandler(err),
//           });
//         }
//         // console.log(result.comments);
//       });
//     // result.postedBy = req.user;
//     // console.log(result);
//     return res.status(201).json(result);
//   });
//   // comment.populate("postedBy", "_id username");
//   // return res.json(comment);
//   // comment.populate('postedBy').execPopulate()
// };

// exports.editComment = (req, res) => {
//   const { commentId } = req.params;
//   const { content } = req.body;
//   if (!content) {
//     return res
//       .status(400)
//       .send({ error: "Please provide a content with your comment." });
//   }
//   try {
//     Comment.findById({ _id: commentId })
//       // CHECK THIS PLS
//       .populate("postedBy", "username")
//       .exec((err, comment) => {
//         if (err) {
//           return res.json({
//             error: errorHandler(err),
//           });
//         }
//         const newComment = { content };
//         // bina lodash ke bhi edit ho sakta hai
//         comment = _.merge(comment, newComment);
//         comment.save((err, result) => {
//           if (err) {
//             return res.json({
//               error: errorHandler(err),
//             });
//           }
//           return res.json(result);
//         });
//       });
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.getComments = async (req, res) => {
  // console.log(req.params.featureId, "comments?");

  let limit = req.query.limit ? parseInt(req.query.limit) : 5;
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;
  console.log(skip, limit);

  const { featureId } = req.params;
  const requestingUserId = req?.auth?._id;

  await Comment.find({ feature: featureId })
    .populate("postedBy", "_id username")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec(async (err, comments) => {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          error: errorHandler(err),
        });
      }

      if (comments && comments.length > 0) {
        //comments = mongose Array of mongose objects
        //change it into array of js objects
        let commentsArray = comments.map((c) => c.toObject());
        if (requestingUserId) {
          await populateCommentLikes(commentsArray, requestingUserId);
          console.log("ye hai array", commentsArray);
          return res.status(200).json(commentsArray);
        } else {
          console.log("Sending Response Mock");
          return res.status(200).json(commentsArray);
        }
      } else {
        return res.json(comments);
      }

      // else return res.status(200).json({ message: "no more data is there" });
    });
};

const populateCommentLikes = (commentsArray, requestingUserId) => {
  return new Promise(async function (res, rej) {
    try {
      // for each comment, foreach usi mei iterate karta hai
      await commentsArray.forEach(async (comment, index) => {
        // console.log(index);

        // get CommentVote model
        var commentvote = await CommentVote.findOne({ comment: comment._id });
        const votes = commentvote.votes;

        // console.log("votes", votes);

        // votes array me check, loggedin userID
        if (votes && votes.length && votes.length > 0) {
          // if present send liked=true

          //map 1 naya array banata jata hai
          const postedByArray = votes.map((v) => v.postedBy);
          console.log("postedByArray ", postedByArray);
          console.log("requestingUserId ", requestingUserId);
          // console.log("Sending Response Iterated");

          commentsArray[index].isLiked =
            postedByArray.includes(requestingUserId);

          // else send liked=false
        } else {
          console.log(index, "=", commentsArray[index].isLiked);
          // else send liked=false
          commentsArray[index].isLiked = false;
        }

        console.log("isLiked ", commentsArray[index].isLiked);

        if (index === commentsArray.length - 1) {
          console.log("Sending Response Iterated");
          // res = resolve rej - reject
          res(commentsArray);
        }
      });
    } catch (error) {
      rej(error);
    }
  });
};

// votes.forEach((vote) => {
//   // console.log("vote.postedy", vote.postedBy);
//   // console.log("auth", req.auth._id);
//   if (vote) {
//     console.log("VOTOTOTO");
//     const liked =
//       vote.postedBy.toString() === req.auth._id.toString();
//     console.log(liked);
//     if (liked) {
//       console.log("abc");
//       return res
//         .status(200)
//         .json({ comment: comment, success: true });
//     }
//   } else if (!liked) {
//     console.log("Tomato");

//     res.json({ comments: comments, success: false });
//   }
//   console.log("this is vote", vote);
//   if (vote.length === 0) {
//     console.log("test");
//   }
//   // let isLiked =
//   //   vote.postedBy.toString() === req.auth._id.toString() &&
//   //   vote.postedBy;
//   // console.log("isLiked", isLiked);
// });

exports.editComment = (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (!content) {
    return res
      .status(400)
      .send({ error: "Please provide a content with your comment." });
  }
  try {
    Comment.findByIdAndUpdate(
      commentId,
      { $set: { content: content, edited: true } },
      { new: true }
    )
      .populate("postedBy", "_id username")
      .exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        } else {
          return res.json(result);
        }
      });
  } catch (err) {
    console.log(err);
  }
};
// bina exec try karo
exports.deleteComment = (req, res) => {
  const { commentId } = req.params;
  Comment.findOne({ _id: commentId }).exec(async (err, comment) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    await CommentVote.deleteOne({ comment: comment._id }).exec();
    await CommentReply.findOne({ comment: comment._id }).exec(
      async (err, commentreply) => {
        if (err) {
          // return res.json({
          //   error: errorHandler(err),
          // });
          console.log(err);
        }
        await CommentReplyVote.findOneAndDelete({
          commentReply: commentreply._id,
        }).exec();
        commentreply.remove();
      }
    );
    comment.remove();

    return res.json({
      message: "Your Comment has been Deleted Successfully",
    });
  });
};

// exports.deleteComment = (req, res) => {
//   const { featureId } = req.params;
//   const { comment } = req.body;
//   Feature.findById({_id: featureId}).exec((err, feature)=>{
//     if(err){
//       return res.json({
//         error: errorHandler(err),
//       });
//     }
//     let comments = feature.comments
//     Comment.findOneAndDelete({_id: comment._id}).exec((err, success)=>{
//       if(err){
//         return res.json
//       }
//     })
//     comments.deleteOne({_id: })

//   })
// };

// module.exports.createComment = async (req, res, next) => {
//   const { featureId } = req.params;
//   const { content } = req.body;
//   const user = req.auth;
//   if (!content) {
//     return res
//       .status(400)
//       .send({ error: "Please provide a content with your comment." });
//   }
//   try {
//     let feature = await Feature.findById(featureId);
//     if (!feature) {
//       return res
//         .status(404)
//         .send({ error: "Could not find a wallpaper with that wallpaper id." });
//     }

//     const comment = new Comment({
//       content,
//       postedBy: user._id,
//       //   feature: featureId,
//     });
//     console.log("ye hai", comment);
//     await comment.save();
//     return res.status(201).json(comment);
//   } catch (err) {
//     next(err);
//   }
// };

//findOneAndUpdate commentVote

///////////////////////////Comment Vote///////////////////
exports.voteComment = (req, res) => {
  //loggedin user khud ke comment pe vote karega to null milega
  // null matlab aisa koi document DB mei mila hi nhi
  const { commentId } = req.params;
  if (!ObjectId.isValid(commentId)) {
    return res.status(400).send({
      error: "Comment ID not valid",
    });
  }

  // find Comment,
  // if Loggedin user === postedbY
  // err = Cannot vote self comment
  Comment.findOne({ _id: commentId }).exec((err, comment) => {
    if (err) {
      console.log(err);
    } // loggedin user cant vote on his comment
    const selfComment =
      comment.postedBy &&
      req.auth._id &&
      comment.postedBy.toString() === req.auth._id.toString();
    if (selfComment) {
      console.log("self");
      return res.status(400).json({
        error: "can not vote on self comment",
      });
    } else {
      CommentVote.findOneAndUpdate(
        {
          comment: commentId,
          // abhi loggedin user khud ke comment pe vote kar pa rha hai
          "comment.postedBy": { $ne: req.auth._id },
          "votes.postedBy": { $ne: req.auth._id },
        },
        // "comment.postedBy": { $ne: req.auth._id } },
        { $push: { votes: { postedBy: req.auth._id } } },
        { new: true }
        // { upsert: true }
      ).exec((err, result) => {
        if (err) {
          console.log("abc", err);
          return res.status(400).json({
            error: "Could not vote on that comment",
          });
        }
        console.log("signle tap", result);
        //document mila hi nhi
        if (result === null) {
          const dislikeComment = CommentVote.findOneAndUpdate(
            {
              comment: commentId,
              postedBy: { $ne: req.auth._id },
              //{ comment ko tab hi dislike karenge agar usko already like karte hai
            },
            {
              $pull: { votes: { postedBy: req.auth._id } },
            },
            { new: true }
          ).exec();

          if (dislikeComment) {
            console.log("double tap");
            return res.send({ success: false });
          }
        }
        res.send({ success: true });
      });
    }
  });
};
//findOneAndUpdate comment
// exports.CvoteComment = (req, res) => {
//   //loggedin user khud ke comment pe vote karega to null milega
//   // null matlab aisa koi document DB mei mila hi nhi
//   const { commentId } = req.params;
//   if (!ObjectId.isValid(commentId)) {
//     return res.status(400).send({
//       error: "Comment ID not valid",
//     });
//   }
//   Comment.findOneAndUpdate(
//     {
//       _id: commentId,
//       postedBy: { $ne: req.auth._id },
//       "votes.postedBy": { $ne: req.auth._id },
//     },
//     // "comment.postedBy": { $ne: req.auth._id } },
//     { $push: { votes: { postedBy: req.auth._id } } },
//     { new: true }
//     // { upsert: true }
//   ).exec((err, result) => {
//     if (err) {
//       console.log("abc", err);
//       return res.status(400).json({
//         error: "Could not vote on that comment",
//       });
//     }
//     //document mila hi nhi
//     if (result === null) {
//       const dislikeComment = Comment.findOneAndUpdate(
//         {
//           _id: commentId,
//           postedBy: { $ne: req.auth._id },
//           //{ comment ko tab hi dislike karenge agar usko already like
//           // karte hai, but galat hai khud logged in user to khud ke
//           //comment ko kabhi like hi nhi kiye hoga to dislike kaise? }
//           // "votes.postedBy": { $eq: req.auth._id },
//         },
//         {
//           $pull: { votes: { postedBy: req.auth._id } },
//         }
//       ).exec();

//       if (dislikeComment) {
//         console.log("double tap");
//         return res.send({ success: false });
//       }
//     }
//     res.send({ success: true });
//   });
// };

// //updateOne comment
// exports.CsvoteComment = async (req, res) => {
//   //loggedin user khud ke comment pe vote karega to nhi hoga i.e. nmodified-0 ok-1
//   //already voted [nmodified-0, ok-0] hai to unvote ho jayega warna vote ho jayega
//   // like karne pe n-1 nModified-1 ok-1
//   // element mil jaye aur update na ho[nModified-0 ok-1]
//   const { commentId } = req.params;
//   if (!ObjectId.isValid(commentId)) {
//     return res.status(400).send({
//       error: "Comment ID not valid",
//     });
//   }
//   const likeComment = await Comment.updateOne(
//     {
//       _id: commentId,
//       postedBy: { $ne: req.auth._id },
//       "votes.postedBy": { $ne: req.auth._id },
//     },
//     // "comment.postedBy": { $ne: req.auth._id } },
//     { $push: { votes: { postedBy: req.auth._id } } },
//     { new: true }
//   ).exec();
//   if (!likeComment.nModified) {
//     if (!likeComment.ok) {
//       return res.status(500).json({
//         error: "could not vote on that comment",
//       });
//     }
//     const dislikeComment = await Comment.updateOne(
//       { _id: commentId },
//       {
//         $pull: { votes: { postedBy: req.auth._id } },
//       }
//     ).exec();
//     if (!dislikeComment.nModified) {
//       return res
//         .status(500)
//         .send({ error: "Could not unvote on the comment." });
//     }
//   }
//   return res.send({ success: true });
// };
// //updateOne commentVote

// exports.avoteComment = async (req, res) => {
//   //loggedin user khud ke comment pe vote karega to nhi hoga i.e. nmodified-0 ok-1
//   //already voted [nmodified-0, ok-0] hai to unvote ho jayega warna vote ho jayega
//   // like karne pe n-1 nModified-1 ok-1
//   // element mil jaye aur update na ho[nModified-0 ok-1]
//   const { commentId } = req.params;
//   if (!ObjectId.isValid(commentId)) {
//     return res.status(400).send({
//       error: "Comment ID not valid",
//     });
//   }
//   const likeComment = await CommentVote.updateOne(
//     {
//       comment: commentId,
//       // postedBy: { $ne: req.auth._id },
//       "votes.postedBy": { $ne: req.auth._id },
//     },
//     // "comment.postedBy": { $ne: req.auth._id } },
//     { $push: { votes: { postedBy: req.auth._id } } },
//     { upsert: true }
//   ).exec();
//   if (!likeComment.nModified) {
//     if (!likeComment.ok) {
//       return res.status(500).json({
//         error: "could not vote on that comment",
//       });
//     }
//     const dislikeComment = await CommentVote.updateOne(
//       { comment: commentId },
//       {
//         $pull: { votes: { postedBy: req.auth._id } },
//       }
//     ).exec();
//     if (!dislikeComment.nModified) {
//       return res
//         .status(500)
//         .send({ error: "Could not unvote on the comment." });
//     }
//   }
//   return res.send({ success: true });
// };

//////////////  COMMENT REPLY //////////////////
exports.createCommentReply = (req, res) => {
  const { commentId } = req.params;
  const { replyContent } = req.body;
  const content = replyContent;
  console.log(replyContent);
  const postedBy = req.auth._id;
  const commentReply = new CommentReply({
    content,
    comment: commentId,
    postedBy: postedBy,
  });
  // console.log(commentReply);
  commentReply.save(async (err, commentreply) => {
    if (err) {
      console.log(err);
      return res.status(400).send({
        error: errorHandler(err),
      });
    }
    const commentReplyVote = new CommentReplyVote({
      commentReply: commentreply._id,
    });
    await commentReplyVote.save();
    return res.json(commentreply);
  });
};

exports.getCommentReplies = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const { commentId } = req.params;
  const requestingUserId = req?.auth?._id;
  console.log("commentId", commentId);
  CommentReply.find({ comment: commentId })
    .populate("postedBy", "_id username")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec(async (err, commentreplies) => {
      if (err) {
        return res.status(400).send({
          error: errorHandler(err),
        });
      }
      const commentReplyArray = commentreplies.map((comment) =>
        comment.toObject()
      );
      console.log(commentReplyArray);
      // return res.json(commentreplies);

      if (commentReplyArray && commentReplyArray.length > 0)
        await populateCommentReplyLikes(commentReplyArray, requestingUserId);
      return res.json(commentReplyArray);
    });
};
const populateCommentReplyLikes = (commentReplyArray, requestingUserId) => {
  return new Promise(async (res, rej) => {
    try {
      await commentReplyArray.forEach(async (commentreply, i) => {
        const commentreplyvote = await CommentReplyVote.findOne({
          commentReply: commentreply._id,
        });
        const votes = commentreplyvote.votes;

        if (votes && votes.length && votes.length > 0) {
          const postedByArray = votes.map((v) => v.postedBy);
          console.log("postedByArray", postedByArray);

          if (requestingUserId) {
            commentReplyArray[i].isLiked =
              postedByArray.includes(requestingUserId);
          } else {
            commentReplyArray[i].isLiked = false;
          }
        } else {
          commentReplyArray[i].isLiked = false;
        }
        console.log("COmment REply", commentReplyArray[i]);
        if (i === commentReplyArray.length - 1) {
          return res(commentReplyArray);
        }
      });
    } catch (error) {
      rej(error);
    }
  });
};

exports.deleteCommentReply = (req, res) => {
  console.log("?");
  const { commentReplyId } = req.params;
  CommentReply.findOne({ _id: commentReplyId }).exec((err, result) => {
    if (err) {
      return res.status(400).send({
        error: errorHandler(err),
      });
    }
    result.remove();
    return res.json({ message: "Your Comment has been Deleted Successfully" });
  });
};

exports.editCommentReply = (req, res) => {
  const { commentReplyId } = req.params;
  const { content } = req.body;
  if (!content) {
    return res
      .status(400)
      .send({ error: "Please provide a content with your comment." });
  }
  CommentReply.findOneAndUpdate(
    { _id: commentReplyId },
    { $set: { content: content } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).send({
        error: errorHandler(err),
      });
    }
    return res.json(result);
  });
};

exports.voteCommentReply = async (req, res) => {
  const { commentReplyId } = req.params;
  const requestingUserId = req.auth._id;
  if (!ObjectId.isValid(commentReplyId)) {
    return res.status(400).send({
      error: "Comment ID not valid",
    });
  }
  await CommentReply.findOne({ _id: commentReplyId }).exec(
    (err, commentreply) => {
      if (err) {
        return res.status(400).send({
          error: errorHandler(err),
        });
      }
      console.log("commentreply", commentreply);
      const selfCommentReply =
        commentreply.postedBy &&
        requestingUserId &&
        commentreply.postedBy.toString() === requestingUserId.toString();
      if (selfCommentReply) {
        return res.status(400).json({
          error: "can not vote on self CommentReply",
        });
      } else {
        CommentReplyVote.findOneAndUpdate(
          {
            commentReply: commentReplyId,
            "votes.postedBy": { $ne: requestingUserId },
          },
          { $push: { votes: { postedBy: requestingUserId } } },
          { new: true }
        ).exec((err, result) => {
          if (err) {
            return res.status(400).send({
              error: errorHandler(err),
            });
          }
          console.log("result", result);
          if (result === null) {
            const disLikeCommentReply = CommentReplyVote.findOneAndUpdate(
              { commentReply: commentReplyId },
              { $pull: { votes: { postedBy: requestingUserId } } },
              {
                new: true,
              }
            ).exec();
            if (disLikeCommentReply) {
              return res.send({ success: false });
            }
          }
          res.send({ success: true });
        });
      }
    }
  );
};
