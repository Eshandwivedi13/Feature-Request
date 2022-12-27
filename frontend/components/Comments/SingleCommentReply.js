import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Media,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback,
} from "reactstrap";
import Link from "next/link";
import { getCookie, isAuth } from "../../api/auth";
import {
  deleteComment,
  deleteCommentReply,
  updateComment,
  updateCommentReply,
} from "../../api/comment";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import { AiOutlineComment } from "react-icons/ai";
import LikeButton from "../Misc/LikeButton";

const SingleComment = ({
  // comment,
  removeCommentReplayFromArray,
  updateSingleCommentReply,
  commentReply,
  updateEditingOfComment,
  editingofCommentReply,
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
    replyTo: false,
    editCommentReplyError: "",
  });
  const {
    editing,
    content,
    error,
    success,
    isLiked,
    replyTo,
    editCommentReplyError,
  } = values;
  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!content && !content.length) {
      return setValues({
        ...values,
        editCommentReplyError: "Content is  Required for Editing",
      });
    }
    if (content.length > 100) {
      return setValues({
        ...values,
        editCommentReplyError: "Content Should be less than 100",
      });
    }
    if (commentReply.content !== content) {
      const editContent = { content };
      updateCommentReply(editContent, token, commentReply._id).then((data) => {
        if (data.error) {
          console.log(data.error);
          setValues({ ...values, error: data.error });
        } else {
          console.log("test");
          // const singleCommentReply = commentReply;
          updateSingleCommentReply(commentReply, data);
          setValues({
            ...values,
            editing: !editing,
            editCommentReplyError: "",
          });
          // setValues({ ...values });
        }
      });
    } else {
      setValues({ ...values, editing: !editing, editCommentReplyError: "" });
    }
  };

  useEffect(() => {
    setValues({
      ...values,
      content: commentReply.content,
      isLiked: commentReply.isLiked,
    });
  }, [commentReply]);

  const deleteConfirm = () => {
    let answer = window.confirm(
      "are you sure you want to delete your commentReply?"
    );
    if (answer) {
      removeComment();
    }
  };
  const removeComment = () => {
    const commentReplyId = commentReply._id;
    deleteCommentReply(token, commentReplyId).then((data) => {
      if (data.error) {
        console.log(data.error);
        setValues({ ...values, error: data.error });
      } else {
        const singleCommentReply = commentReply;
        removeCommentReplayFromArray(singleCommentReply);
        setValues({ ...values, success: data.message });
      }
    });
  };

  return (
    <React.Fragment>
      <Media className="mt-3">
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
            <div style={{ overflowWrap: "anywhere" }}>
              {editing ? (
                <div>
                  <Input
                    type="text"
                    placeholder="Edit your Comment"
                    value={content}
                    invalid={editCommentReplyError}
                    onChange={(e) => {
                      setValues({ ...values, content: e.target.value });
                    }}
                  />
                  {editCommentReplyError && (
                    <FormFeedback style={{ fontSize: ".61em" }}>
                      {editCommentReplyError}
                    </FormFeedback>
                  )}
                </div>
              ) : (
                commentReply.content
              )}
              {isAuth() && !editing && (
                <div className="d-inline-flex float-right align-items-center">
                  {/* <FcLike className="mx-2" onClick={handleLike} /> */}
                  {isAuth() &&
                    !(isAuth()._id === commentReply.postedBy._id) && (
                      <LikeButton
                        id={commentReply._id}
                        type="commentReply"
                        isLiked={isLiked}
                        // handleUpdate child chalayega aur liked ko update karega
                        handleUpdate={(value) =>
                          setValues({ ...values, isLiked: value })
                        }
                      />
                    )}
                  <AiOutlineComment
                  // onClick={() => setValues({ ...values, replyTo: !replyTo })}
                  />
                  <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle nav>
                      <BsThreeDotsVertical onClick={toggle} />
                    </DropdownToggle>
                    <DropdownMenu className="mr-5">
                      <DropdownItem header>Options</DropdownItem>
                      <DropdownItem divider />

                      {isAuth() &&
                        isAuth()._id === commentReply.postedBy._id &&
                        !editing && (
                          <React.Fragment>
                            <DropdownItem
                              onClick={() => {
                                setValues({
                                  ...values,
                                  editing: !editing,
                                  ShowAddReply: false,

                                  // content: commentReply.content,
                                });
                                updateEditingOfComment(false);
                                console.log("Click kiya");
                              }}
                            >
                              Edit Reply
                            </DropdownItem>{" "}
                            <DropdownItem
                              onClick={() => {
                                deleteConfirm();
                              }}
                              style={{ color: "#dc3545" }}
                            >
                              Delete Reply
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
          <Media heading>
            <div className="">
              <p className="lead">
                {" "}
                Posted by {""}
                <Link href={`/user/${commentReply.postedBy.username}`}>
                  {commentReply.postedBy.username} {""}
                </Link>
                on {new Date(commentReply.createdAt).toDateString()}
              </p>
              <p>
                {isAuth() &&
                  isAuth()._id === commentReply.postedBy._id &&
                  editing && (
                    <React.Fragment>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={handleSubmitClick}
                      >
                        Submit
                      </Button>
                      <Button
                        color="danger ml-3 mr-1"
                        size="sm"
                        onClick={() => {
                          setValues({
                            ...values,
                            editing: !editing,
                            content: commentReply.content,
                            editCommentReplyError: "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </React.Fragment>
                  )}
              </p>
            </div>
            {/* Input de sakte yaha */}

            {/* <div>
              {isAuth() && replyTo && (
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
                    <Media>
                      <div
                        // className="pr-5"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        {" "}
                        Nested media heading Cras sit amet nibh libero, india
                      </div>
                    </Media>
                  </Media>
                </Media>
              )}
            </div> */}
          </Media>
        </Media>
      </Media>
    </React.Fragment>
  );
};

export default SingleComment;
