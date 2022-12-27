const express = require("express");
const router = express.Router();
const {
  requireSignin,
  canEditDeleteComment,
  optionalSignin,
  canEditDeleteCommentReply,
} = require("../controllers/auth");
const {
  createComment,
  getComments,
  deleteComment,
  editComment,
  voteComment,
  createCommentReply,
  getCommentReplies,
  deleteCommentReply,
  editCommentReply,
  voteCommentReply,
} = require("../controllers/comment");
//comment
router.post("/comment/:featureId", requireSignin, createComment);
router.delete(
  "/uncomment/:commentId",
  requireSignin,
  canEditDeleteComment,
  deleteComment
);
router.patch(
  "/comment/:commentId",
  requireSignin,
  canEditDeleteComment,
  editComment
);
router.get("/comment/:featureId", optionalSignin, getComments);

//commentvote
router.post("/comment/vote/:commentId", requireSignin, voteComment);

//commentReply
router.post("/comment/reply/:commentId", requireSignin, createCommentReply);
router.get("/comment/reply/:commentId", optionalSignin, getCommentReplies);
router.delete(
  "/comment/reply/:commentReplyId",
  requireSignin,
  canEditDeleteCommentReply,
  deleteCommentReply
);
router.patch(
  "/comment/reply/:commentReplyId",
  requireSignin,
  canEditDeleteCommentReply,
  editCommentReply
);
//commentReply Vote
router.post(
  "/comment/reply/vote/:commentReplyId",
  requireSignin,
  voteCommentReply
);

module.exports = router;
