const Page = require("../models/Page");
const { errorHandler } = require("../helpers");
const slugify = require("slugify");
const Feature = require("../models/feature");
const Comment = require("../models/Comment");
const FeatureVote = require("../models/FeatureVote");
const CommentVote = require("../models/CommentVote");
const CommentReply = require("../models/CommentReply");
const CommentReplyVote = require("../models/CommentReplyVote");

exports.makePage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const postedBy = req.auth._id;
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
    if (title.length > 100) {
      return res.status(400).json({
        error: "Title is too Large",
      });
    }
    if (!description || !description.length) {
      return res.status(400).json({
        error: "Description is Required",
      });
    }
    if (description.length < 25) {
      return res.status(400).json({
        error: "Description  is too short",
      });
    }
    if (description.length > 750) {
      return res.status(400).json({
        error: "Description  is too Long",
      });
    }

    const newPage = new Page({
      title,
      description,
      postedBy,
    });
    //   console.log(page);
    newPage.slug = slugify(title).toLowerCase();
    let excerpt =
      description.substring(0, 155) + (description.length > 155 ? "..." : "");
    newPage.excerpt = excerpt;
    await newPage.save((err, page) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      return res.status(200).json(page);
    });
  } catch (error) {
    console.log(error);
  }
};

// exports.getSinglePage = async (req, res) => {
//   console.log("Test");
//   try {
//     let limit = req.query.limit ? parseInt(req.query.limit) : 5;
//     let skip = req.query.skip ? parseInt(req.query.skip) : 0;
//     const { slug } = req.params;
//     const pageFound = await Page.findOne({ slug: slug.toLowerCase() });
//     console.log("pageFound");
//     const pageId = pageFound._id;
//     const featuresFound = await Feature.find({ page: pageId })
//       .limit(limit)
//       .skip(skip)
//       .exec();
//     // const data = { pageFound, featuresFound };
//     // console.log(data.pageFound);
//     // console.log(data.featuresFound, "ye dusra");
//     return res.status(200).json({ pageFound, featuresFound });
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.getSinglePage = async (req, res) => {
  console.log("Test");
  try {
    const { slug } = req.params;
    const pageFound = await Page.findOne({ slug: slug.toLowerCase() });
    return res.status(200).json(pageFound);
  } catch (error) {
    console.log(error);
  }
};

exports.getAllPages = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;
  try {
    Page.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("title excerpt slug")
      .exec((err, pages) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        return res.status(200).json(pages);
      });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllPagesFromUser = async (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const postedBy = req?.auth?._id;

    Page.find({ postedBy: postedBy })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("title excerpt slug")
      .exec((err, pagesFromUser) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        return res.status(200).json(pagesFromUser);
      });
  } catch (error) {
    console.log(error);
  }
};

// updatePage without Lodash
exports.updatePage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { slug } = req.params;
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
    if (title.length > 100) {
      return res.status(400).json({
        error: "Title is too Large",
      });
    }
    if (!description || !description.length) {
      return res.status(400).json({
        error: "Description is Required",
      });
    }
    if (description.length < 25) {
      return res.status(400).json({
        error: "Description  is too short",
      });
    }
    if (description.length > 750) {
      return res.status(400).json({
        error: "Description  is too Long",
      });
    }
    Page.findOne({ slug: slug.toLowerCase() }).exec(async (err, page) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      // let newPage = {title, description, postedBy}
      page.title = title;
      page.description = description;
      let excerpt =
        description.substring(0, 155) + (description.length > 155 ? "..." : "");
      page.excerpt = excerpt;

      console.log("page", page.slug);
      await page.save((err, updatedPage) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        return res.status(200).json(updatedPage);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug: slug.toLowerCase() });
    // bina exec delete try karna pehle
    console.log("page", page);
    const features = await Feature.find({ page: page._id });
    features.forEach(async (feature) => {
      console.log("featuree", feature);
      const featureVote = await FeatureVote.deleteOne({
        feature: feature._id,
      });
      console.log("featureVote", featureVote);
      const comments = await Comment.find({ feature: feature._id });
      comments.forEach(async (comment) => {
        console.log("comment", comment);
        const commentVote = await CommentVote.deleteOne({
          comment: comment._id,
        });
        console.log("commentVote", commentVote);
        const commentReplies = await CommentReply.find({
          comment: comment._id,
        });
        commentReplies.forEach(async (commentReply) => {
          console.log("reply", commentReply);
          const replyVote = await CommentReplyVote.deleteOne({
            commentReply: commentReply._id,
          });
          commentReply.remove();
        });
        comment.remove();
      });
      feature.remove();
    });
    page.remove();
    return res
      .status(200)
      .json({ message: "Your Page Has Been Delete Succuessfully" });
  } catch (error) {}
};

//Three ways for creating Search Functionality -
//1) req.body.search then, .find({$text: {$search: req.body.search}})
//2) req.params.search then, .find({$or:[{name:{$regex : req.params.search}}]})
//3) req.query.search then, same as 2nd method (guruji method jaisa h)

exports.searchPages = async (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0;
    // key lo ya search lo, frontend se search a rha hai
    const { key } = req.params;
    const pages = await Page.find({
      $or: [
        {
          title: { $regex: key, $options: "i" },
        },
        {
          description: { $regex: key },
        },
      ],
    })
      .skip(skip)
      .limit(limit)
      .select("_id title excerpt slug postedBy")
      .sort({ createdAt: -1 });

    console.log(pages);
    res.json(pages);
  } catch (error) {
    console.log(error);
  }
};
