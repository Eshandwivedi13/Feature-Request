import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Media,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Link from "next/link";
import { getCookie, isAuth } from "../../api/auth";
import {
  deleteComment,
  getAllCommentReplies,
  makeCommentReply,
  updateComment,
} from "../../api/comment";
import { BsArrowBarRight, BsThreeDotsVertical } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import { AiOutlineComment } from "react-icons/ai";
import LikeButton from "../Misc/LikeButton";
import SingleCommentReply from "../Comments/SingleCommentReply";
const SingleComment = ({
  comment,
  removeCommentFromArray,
  updateSingleComment,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const token = getCookie("token");
  const [values, setValues] = useState({
    editing: false,
    content: "",
    // content: comment.content,
    // props ko update nhi kiya ja sakta to usko var mei leke update kro
    error: false,
    success: false,
    isLiked: false,
    showCommentReplies: false,
    commentReplyArray: [],
    replyContent: "",
    limit: 4,
    skip: 0,
    hasMore: true,
  });
  const {
    editing,
    content,
    error,
    success,
    isLiked,
    showCommentReplies,
    commentReplyArray,
    replyContent,
    limit,
    skip,
    hasMore,
  } = values;

  const handleClick = (e) => {
    e.preventDefault();
    if (!content) {
      return console.log("Content is Required");
    }
    if (comment.content !== content) {
      const editContent = { content };
      updateComment(editContent, token, comment._id).then((data) => {
        if (data.error) {
          console.log(data.error);
          setValues({ ...values, error: data.error });
        } else {
          updateSingleComment(comment, data);
          setValues({ ...values, editing: !editing });
          // setValues({ ...values });
        }
      });
    }
  };

  useEffect(() => {
    // console.log(comment.isLiked);
    setValues({
      ...values,
      content: comment.content,
      isLiked: comment.isLiked,
    });
  }, [comment]);

  const deleteConfirm = () => {
    let answer = window.confirm("are you sure you want to delete your blog?");
    if (answer) {
      removeComment();
    }
  };
  const removeComment = () => {
    const commentId = comment._id;
    deleteComment(token, commentId).then((data) => {
      if (data.error) {
        console.log(data.error);
        setValues({ ...values, error: data.error });
      } else {
        removeCommentFromArray(comment);
        console.log(data);
        setValues({ ...values, success: data.message });
      }
    });
  };

  // const commentReplies = async () => {
  //   let finalData;

  //   await getAllCommentReplies(comment._id, token).then((data) => {
  //     if (data.error) {
  //       console.log(data.error);
  //       // setValues({ ...values, error: data.error });
  //       finalData = [];
  //     } else {
  //       // setValues({ ...values, commentReplyArray: data });
  //       // console.log(data);
  //       finalData = data;
  //     }
  //   });

  //   return finalData;
  // };

  //Comment Reply ---
  const commentReplies = () =>
    getAllCommentReplies(comment._id, token, skip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
        return [];
      } else {
        return data;
      }
    });
  const handleCommentReply = async () => {
    let replies;
    // 2 setVaLUes nhi laga sakte, dikkat hoti hai, react state update ko batch karta hai lifeCycle mei
    //
    // agar showCOmmentreplies false hai to commenTreplies le aao kyunki state fatak se update nhi hoti
    //showCommentReply click karne pe true hota hai par delay se hota hai to shuru mei false rehta hai and vice versa
    if (!showCommentReplies) {
      //show commentReplies false to ye condition true balle balle-
      replies = await commentReplies();
    }
    console.log("pressed bro", showCommentReplies);
    setValues({
      ...values,
      showCommentReplies: !showCommentReplies,
      commentReplyArray: replies,
    });
    console.log("show Comment Repliesz");
  };
  // const commentReplies = () =>
  //   getAllCommentReplies(comment._id, token).then((data) => {
  //     if (data.error) {
  //       console.log(data.error);
  //       setValues({ ...values, error: data.error });
  //       return [];
  //     } else {
  //       setValues({
  //         ...values,
  //         commentReplyArray: data,
  //         showCommentReplies: !showCommentReplies,
  //       });
  //     }
  //   });
  // const handleCommentReply = () => {
  //   if (!showCommentReplies) {
  //     commentReplies();
  //   }
  //   setValues({
  //     ...values,
  //     showCommentReplies: !showCommentReplies,
  //   });
  //   // pehle ye tha=
  //   // if (showCommentReplies) {
  //   //   commentReplies();
  //   // }
  // };

  const mapCommentReplies = () => {
    if (commentReplyArray && commentReplyArray.length > 0)
      // console.log("?? batao");
      return commentReplyArray.map((cr, i) => {
        // console.log("?? jatao");
        return (
          <div key={i}>
            <SingleCommentReply
              commentReply={cr}
              removeCommentReplayFromArray={(singleCommentReply) => {
                const index = commentReplyArray.indexOf(singleCommentReply);
                // index- kaha se remove karna hai, aur kaha tak
                commentReplyArray.splice(index, 1);
                setValues({ ...values, commentReplyArray: commentReplyArray });
              }}
              updateSingleCommentReply={(
                oldCommentReply,
                editedCommentReply
              ) => {
                console.log("before", commentReplyArray);
                const index = commentReplyArray.indexOf(oldCommentReply);
                if (index !== -1) {
                  commentReplyArray[index].content = editedCommentReply.content;
                  console.log("after", commentReplyArray);
                }
              }}
            />
          </div>
        );
      });
    else return null;
  };
  const handleAddReply = () => {
    // commentReplyContent hai ye
    const content = { replyContent };
    const commentId = comment._id;
    makeCommentReply(content, token, commentId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        let newCommentReply = data;
        newCommentReply.postedBy = isAuth();
        const tempCommentReply = commentReplyArray;
        tempCommentReply.unshift(newCommentReply);
        setValues({
          ...values,
          commentReplyArray: tempCommentReply,
          replyContent: "",
        });
      }
    });
  };
  const loadMoreReply = () => {
    let toSkip = skip + limit;
    const commentId = comment._id;

    getAllCommentReplies(commentId, token, skip, limit).then((data) => {
      if (data.error) {
        if (data.error) {
          console.log(data.error);
          setValues({ ...values, commentError: data.error });
        }
      } else {
        let tempCommentReplies = [...commentReplyArray, ...data];
        setValues({
          ...values,
          commentReplyArray: tempCommentReplies,
          skip: toSkip,
          hasMore: !(data.length < limit),
        });
        // console.log(comments.length);
      }
    });
  };
  return (
    <React.Fragment>
      <Media>
        <Media>
          <Media
            className="mr-2"
            src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA14dHoX.img?w=612&h=408&m=6&x=297&y=139&s=355&d=355"
            height="50vh"
            width="50vw"
            style={{ borderRadius: "47%", objectFit: "cover" }}
            alt="Generic placeholder image"
          />
        </Media>
        <Media body>
          <Media heading>
            <div className="" style={{ overflowWrap: "anywhere" }}>
              {editing ? (
                <Input
                  type="text"
                  placeholder="Edit your Comment"
                  value={content}
                  onChange={(e) => {
                    setValues({ ...values, content: e.target.value });
                  }}
                />
              ) : (
                comment.content
              )}
              {isAuth() && !editing && (
                <div className="d-inline-flex float-right align-items-center">
                  {/* <FcLike className="mx-2" onClick={handleLike} /> */}
                  {isAuth() && !(isAuth()._id === comment.postedBy._id) && (
                    <LikeButton
                      id={comment._id}
                      type="comment"
                      isLiked={isLiked}
                      // handleUpdate child chalayega aur liked ko update karega
                      handleUpdate={(value) =>
                        setValues({ ...values, isLiked: value })
                      }
                      // liked={liked}
                    />
                  )}
                  {/* {isAuth() && (
                    <LikeButton
                      id={comment._id}
                      type="comment"
                      handleUpdate={(value) =>
                        setValues({ ...values, liked: value })
                      }
                      liked={liked}
                      // handleChange={(value) => {}}
                    />
                  )} */}
                  <AiOutlineComment onClick={handleCommentReply} />
                  <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle nav>
                      <BsThreeDotsVertical onClick={toggle} />
                    </DropdownToggle>
                    <DropdownMenu className="mr-5">
                      <DropdownItem header>Options</DropdownItem>
                      <DropdownItem divider />

                      {isAuth() &&
                        isAuth()._id === comment.postedBy._id &&
                        !editing && (
                          <React.Fragment>
                            <DropdownItem
                              onClick={() => {
                                setValues({
                                  ...values,
                                  editing: !editing,
                                });
                              }}
                            >
                              Edit Comment
                            </DropdownItem>{" "}
                            <DropdownItem
                              onClick={() => {
                                deleteConfirm();
                              }}
                              style={{ color: "#dc3545" }}
                            >
                              Delete Comment
                            </DropdownItem>
                          </React.Fragment>
                        )}
                      <DropdownItem>Report</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </div>
          </Media>

          <div className="">
            <p className="lead">
              {" "}
              Posted by {""}
              <Link href={`/user/${comment.postedBy.username}`}>
                {comment.postedBy.username} {""}
              </Link>
              on {new Date(comment.createdAt).toDateString()}
            </p>
            <p>
              {isAuth() && isAuth()._id === comment.postedBy._id && editing && (
                <React.Fragment>
                  <Button color="primary" size="sm" onClick={handleClick}>
                    Submit
                  </Button>
                  <Button
                    color="danger ml-3 mr-1"
                    size="sm"
                    onClick={() => {
                      setValues({
                        ...values,
                        editing: !editing,
                        content: comment.content,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </React.Fragment>
              )}
              {/* {isAuth() && !editing && a} */}
            </p>
          </div>
          <Media heading>
            <div>
              {showCommentReplies && (
                <div>
                  {mapCommentReplies()}
                  {commentReplyArray &&
                    commentReplyArray.length > 0 &&
                    hasMore && (
                      <Button
                        className="mx-auto mb-2"
                        color="primary"
                        size="sm"
                        onClick={loadMoreReply}
                      >
                        Load More
                      </Button>
                    )}
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="Post your Reply"
                    value={replyContent}
                    onChange={(e) => {
                      setValues({ ...values, replyContent: e.target.value });
                    }}
                  />
                  <Button
                    className="my-2"
                    size="sm"
                    color="primary"
                    onClick={handleAddReply}
                  >
                    Add Reply
                  </Button>
                </div>
              )}
            </div>
          </Media>
          {/* <Media>
            <Media body>
              <Media heading>
                <Input
                  type="text"
                  placeholder="Post your Reply"
                  // value={}
                  onChange={(e) => {
                    setValues({ ...values, content: e.target.value });
                  }}
                />
              </Media>
            </Media>
          </Media> */}
        </Media>
      </Media>
    </React.Fragment>
  );
};

export default SingleComment;
// <Media>
//   <Media>
//     <Media
//       className="mr-2"
//       src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA14dHoX.img?w=612&h=408&m=6&x=297&y=139&s=355&d=355"
//       height="50vh"
//       width="50vw"
//       style={{ borderRadius: "47%", objectFit: "cover" }}
//       alt="Generic placeholder image"
//     />
//   </Media>
//   <Media body>
//     <Media>
//       <div
//         // className="pr-5"
//         style={{ overflowWrap: "anywhere" }}
//       >
//         {" "}
//         Nested media heading Cras sit amet nibh libero, india
//       </div>
//     </Media>
//   </Media>
// </Media>
// className="d-flex justify-content-center"
// <SingleCommentReply commentReply={commentReply} />
