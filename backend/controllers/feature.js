const User = require("../models/user");
const Feature = require("../models/feature");
const { errorHandler } = require("../helpers");
const slugify = require("slugify");
const _ = require("lodash");
const Comment = require("../models/Comment");
const CommentVote = require("../models/CommentVote");
const FeatureVote = require("../models/FeatureVote");
const CommentReply = require("../models/CommentReply");
const CommentReplyVote = require("../models/CommentReplyVote");
var ObjectId = require("mongoose").Types.ObjectId;

// const feature = require("../models/feature");

exports.makeFeature = async (req, res) => {
  const { title, description } = req.body;
  const { pageId } = req.params;
  try {
    if (!title || !title.length) {
      return res.status(400).json({
        error: "Title is Required",
      });
    }
    if (title.length < 5) {
      return res.status(400).json({
        error: "Title is too short",
      });
    }
    if (!description || !description.length) {
      return res.status(400).json({
        error: "Description is Required",
      });
    }
    if (description.length < 20) {
      return res.status(400).json({
        error: "Description  is too short",
      });
    }

    let newfeature = new Feature({ title, description, page: pageId });
    newfeature.slug = slugify(title).toLowerCase();

    // let excerpt = newfeature.description.substring(0, 120);
    // newfeature.excerpt = newfeature.description.substring(0, 120);
    // if (excerpt.length >= 120) {
    //   console.log();
    //   const finalExcerpt = excerpt.concat("...");
    //   excerpt = finalExcerpt;
    // }

    let excerpt =
      description.substring(0, 120) + (description.length > 120 ? "..." : "");

    //bodmas jaisa rule to ye neche wala not working
    // let excerpt =
    //   description.substring(0, 120) + description.length > 120 ? "..." : "";

    newfeature.excerpt = excerpt;
    newfeature.postedBy = req.auth._id;
    // console.log("this is the voice", newfeature.postedBy);
    newfeature.save((err, feature) => {
      console.log(err);
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      // console.log("this is the voice", feature.postedBy);
      const featureVote = new FeatureVote({
        feature: feature._id,
      });
      featureVote.save();
      // check here
      return res.json(feature);
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
};
// loggedIn user's feature
exports.getAllFeaturesFromUser = async (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const postedBy = req?.auth?._id;
    Feature.find({ postedBy: postedBy })
      .skip(skip)
      .limit(limit)
      .select("title excerpt slug")
      .sort({ createdAt: -1 })
      .exec((err, featuresFromUser) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        console.log("loggedin user ka", featuresFromUser);
        return res.status(200).json(featuresFromUser);
      });
  } catch (error) {
    console.log(error);
  }
};
// ALL Features
exports.getAllFeatures = async (req, res) => {
  console.log("test");
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0;
    Feature.find()
      .skip(skip)
      .limit(limit)
      .select("title excerpt slug")
      .sort({ createdAt: -1 })
      .exec((err, featuresFromUser) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        return res.status(200).json(featuresFromUser);
      });
  } catch (error) {
    console.log(error);
  }
};

// Features of Page
exports.getAllFeaturesOfPage = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const requestingUserId = req?.auth?._id;
  const { pageId } = req.params;

  try {
    Feature.find({ page: pageId })
      .populate("postedBy", " email _id username")
      .skip(skip)
      .limit(limit)
      // .select("_id title description slug excerpt postedBy createdAt updatedAt")
      .sort({ createdAt: -1 })
      .exec(async (err, features) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        console.log(features);
        if (features.length > 0) {
          const featuresArray = features.map((feature) => feature.toObject());
          await populateFeaturesLikes(featuresArray, requestingUserId);
          return res.status(200).json(featuresArray);
        } else return res.status(200).json(features);
      });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};
const populateFeaturesLikes = (featuresArray, requestingUserId) => {
  return new Promise(async function (res, rej) {
    try {
      await featuresArray.forEach(async (feature, i) => {
        //
        console.log("postedBy", feature.postedBy);
        const featurevote = await FeatureVote.findOne({
          feature: feature._id,
        });
        const votes = featurevote.votes;
        // console.log(votes, "This is the voice dang dang dang");
        if (votes && votes.length && votes.length > 0) {
          if (requestingUserId) {
            const postedByArray = votes.map((v) => v.postedBy);
            featuresArray[i].isLiked = postedByArray.includes(requestingUserId);
            // console.log(postedByArray);
          } else {
            featuresArray[i].isLiked = false;
          }
          //main
          featuresArray[i].votesCount = votes.length;
        } else {
          featuresArray[i].votesCount = 0;
          featuresArray[i].isLiked = false;
        }
        if (i === featuresArray.length - 1) {
          console.log("Sending Response Iterated");
          // console.log(featuresArray, "length vote");
          return res(featuresArray);
        }
      });
    } catch (error) {
      rej(error);
    }
  });
};

// const populateFeaturesLikes = (featuresArray, requestingUserId) => {
//   return new Promise(async function (res, rej) {
//     try {
//       await featuresArray.forEach(async (feature, i) => {
//         const featurevote = await FeatureVote.findOne({
//           feature: feature._id,
//         });
//         const votes = featurevote.votes;
//         console.log(votes, "This is the voice dang dang dang");
//         if (votes && votes.length && votes.length > 0) {
//           if (requestingUserId) {
//             const postedByArray = votes.map((v) => v.postedBy);
//             featuresArray[i].isLiked = postedByArray.includes(requestingUserId);
//           } else {
//             featuresArray[i].isLiked = false;
//           }
//           //main
//           featuresArray[i].votesCount = votes.length;
//         } else {
//           featuresArray[i].votesCount = 0;
//           featuresArray[i].isLiked = false;
//         }
//         if (i === featuresArray.length - 1) {
//           console.log("Sending Response Iterated");
//           console.log(featuresArray, "length vote");
//           return res(featuresArray);
//         }
//       });
//     } catch (error) {
//       rej(error);
//     }
//   });
// };
exports.getSingleFeature = async (req, res) => {
  const requestingUserId = req?.auth?._id;
  console.log("requestingUserId = ", requestingUserId);
  try {
    const { slug } = req.params;
    await Feature.findOne({ slug: slug.toLowerCase() })
      .populate("postedBy", " _id username")
      .populate("page", " title description")
      .exec(async (err, feature) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        // console.log(feature.page, "featurepage");
        if (requestingUserId) {
          // promise return kar rha tha to hme async await karna padega
          var featurevote = await FeatureVote.findOne({ feature: feature._id });
          const votes = featurevote.votes;
          // mongoose objcect ko js object bana lo taaki isliked add ho paye
          const featureToSend = feature.toObject();
          if (votes && votes.length && votes.length > 0) {
            const postedByArray = votes.map((v) => v.postedBy);
            featureToSend.isLiked = postedByArray.includes(requestingUserId);
            console.log(featureToSend.isLiked, "feature liked or not");
          } else {
            featureToSend.isLiked = false;
          }
          return res.status(200).json(featureToSend);
        } else {
          return res.status(200).json(feature);
        }
      });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

// exports.getComments = async (req, res) => {
//   const { featureId } = req.params;
//   const requestingUserId = req?.auth?._id;

//   Comment.find({ feature: featureId })
//     .populate("postedBy", "_id username")
//     .sort({ createdAt: -1 })
//     .exec(async (err, comments) => {
//       if (err) {
//         // console.log(err);
//         return res.status(400).send({
//           error: errorHandler(err),
//         });
//       }
//       //comments = mongose Array of mongose objects
//       //change it into array of js objects
//       let commentsArray = comments.map((c) => c.toObject());
//       if (requestingUserId) {
//         await populateCommentLikes(commentsArray, requestingUserId);

//         return res.status(200).json(commentsArray);
//       } else {
//         console.log("Sending Response Mock");
//         return res.status(200).json(commentsArray);
//       }
//     });
// };

// const populateCommentLikes = (commentsArray, requestingUserId) => {
//   return new Promise(async function (res, rej) {
//     try {
//       // for each comment, foreach usi mei iterate karta hai
//       await commentsArray.forEach(async (comment, index) => {
//         // console.log(index);

//         // get CommentVote model
//         var commentvote = await CommentVote.findOne({ comment: comment._id });
//         const votes = commentvote.votes;

//         // console.log("votes", votes);

//         // votes array me check, loggedin userID
//         if (votes && votes.length && votes.length > 0) {
//           // if present send liked=true

//           //map 1 naya array banata jata hai
//           const postedByArray = votes.map((v) => v.postedBy);
//           console.log("postedByArray ", postedByArray);
//           console.log("requestingUserId ", requestingUserId);
//           // console.log("Sending Response Iterated");

//           commentsArray[index].isLiked =
//             postedByArray.includes(requestingUserId);

//           // else send liked=false
//         } else {
//           console.log(index, "=", commentsArray[index].isLiked);
//           // else send liked=false
//           commentsArray[index].isLiked = false;
//         }

//         console.log("isLiked ", commentsArray[index].isLiked);

//         if (index === commentsArray.length - 1) {
//           console.log("Sending Response Iterated");
//           // res = resolve rej - reject
//           res(commentsArray);
//         }
//       });
//     } catch (error) {
//       rej(error);
//     }
//   });
// };

exports.deleteFeature = (req, res) => {
  try {
    const { slug } = req.params;
    Feature.findOne({ slug: slug.toLowerCase() }).exec(async (err, feature) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      await FeatureVote.findOneAndDelete({ feature: feature._id });
      await Comment.find({ feature: feature._id }).exec((err, comments) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        // console.log(comments);
        comments.forEach(async (comment) => {
          await CommentVote.deleteOne({ comment: comment._id });
          await CommentReply.find((err, commentReplies) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            commentReplies.forEach(async (commentReply) => {
              await CommentReplyVote.deleteOne({
                commentReply: commentReply._id,
              });
              commentReply.remove();
            });
          });
          comment.remove();
        });
        feature.remove();
      });

      return res.json({
        message: "Your Feature has been Deleted Successfully",
      });
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

// exports.deleteFeature = (req, res) => {
//   try {
//     const { slug } = req.params;

//     Feature.deleteOne({ slug: slug.toLowerCase() }).exec((err, data) => {
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler(err),
//         });
//       }
//       return res.json({
//         message: "Your Feature has been Deleted Successfully",
//       });
//     });
//   } catch (error) {
//     return res.status(400).json({
//       error: error,
//     });
//   }
// };

exports.updateFeature = (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description } = req.body;
    Feature.findOne({ slug: slug.toLowerCase() }).exec((err, oldFeature) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      if (!title || !title.length) {
        return res.status(400).json({
          error: "Title is Required",
        });
      }
      if (title.length < 5) {
        return res.status(400).json({
          error: "Title is too short",
        });
      }
      if (!description || !description.length) {
        return res.status(400).json({
          error: "Description is Required",
        });
      }
      if (description.length < 20) {
        return res.status(400).json({
          error: "Description  is too short",
        });
      }
      // let slugBefore = oldFeature.slug;
      // let featureNew = { title, description };

      // let excerpt = featureNew.description.substring(0, 120);
      // if (excerpt.length >= 120) {
      //   console.log();
      //   const finalExcerpt = excerpt.concat("...");
      //   excerpt = finalExcerpt;
      // }
      // featureNew.excerpt = excerpt;

      let featureNew = { title, description };

      let excerpt =
        description.substring(0, 120) + (description.length > 120 ? "..." : "");

      featureNew.excerpt = excerpt;

      oldFeature = _.merge(oldFeature, featureNew);
      //  oldFeature.slug = slugBefore
      oldFeature.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(result);
      });
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.voteFeature = (req, res) => {
  const { featureId } = req.params;
  if (!ObjectId.isValid(featureId)) {
    return res.status(400).send({
      error: "Comment ID not valid",
    });
  }
  Feature.findOne({ _id: featureId }).exec((err, feature) => {
    if (err) {
      console.log(err);
    }
    const selfFeature =
      feature.postedBy &&
      req.auth._id &&
      feature.postedBy.toString() === req.auth._id.toString();
    if (selfFeature) {
      console.log("self");
      return res.status(400).json({
        error: "can not vote on self Feature",
      });
    } else {
      FeatureVote.findOneAndUpdate(
        {
          feature: featureId,
          // "comment.postedBy": { $ne: req.auth._id },
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
          const dislikeFeature = FeatureVote.findOneAndUpdate(
            {
              feature: featureId,
              postedBy: { $ne: req.auth._id },
              //{ comment ko tab hi dislike karenge agar usko already like
              // karte hai, but galat hai khud logged in user to khud ke
              //comment ko kabhi like hi nhi kiye hoga to dislike kaise? }
              // "votes.postedBy": { $eq: req.auth._id },
            },
            {
              $pull: { votes: { postedBy: req.auth._id } },
            },
            { new: true }
          ).exec();

          if (dislikeFeature) {
            console.log("double tap");
            return res.send({ success: false });
          }
          // return res.json({
          //   error: "Cant vote on your comment again",
          // });
        }
        res.send({ success: true });
      });
    }
  });
};

// exports.getAllFeature = (req, res) => {
//   let limit = req.query.limit ? parseInt(req.query.limit) : 5;
//   let skip = req.query.skip ? parseInt(req.query.skip) : 0;
//   const requestingUserId = req?.auth?._id;

//   try {
//     Feature.find()
//       .populate("postedBy", " email _id username")
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .exec(async (err, features) => {
//         if (err) {
//           return res.status(400).json({
//             error: errorHandler(err),
//           });
//         }

//         const featuresArray = features.map((feature) => feature.toObject());
//         await featuresArray.forEach(async (feature, i) => {
//           const featurevote = await FeatureVote.findOne({
//             feature: feature._id,
//           });
//           const votes = featurevote.votes;
//           if (votes && votes.length && votes.length > 0) {
//             // const postedByArray = votes.map((v) => v.postedBy);
//             // featuresArray[i].isLiked = postedByArray.includes(requestingUserId);
//             //main
//             featuresArray[i].votesCount = votes.length;
//           } else {
//             featuresArray[i].votesCount = 0;
//           }
//           if (i === featuresArray.length - 1) {
//             console.log("Sending Response Iterated");
//             console.log(featuresArray, "length vote");

//             return res.status(200).json(featuresArray);
//           }
//         });

//         return res.status(200).json(featuresArray);
//       });
//   } catch (error) {
//     return res.status(400).json({
//       error: error,
//     });
//   }
// };
