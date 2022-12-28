import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import {
  Card,
  CardTitle,
  CardText,
  Col,
  Row,
  Container,
  Button,
  Input,
  Alert,
  Spinner,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import Link from "next/link";
import { FcLike } from "react-icons/fc";
import { useRouter } from "next/router";
import { getCookie, isAuth } from "../../api/auth";
import { deleteFeature, getSingleFeature } from "../../api/feature";
import Update from "../../components/Feature/Update";
import { makeComment, getAllComments } from "../../api/comment";
import Comment from "../../components/Comments/Comment";
import SingleComment from "../../components/Comments/SingleComment";
import LikeButton from "../../components/Misc/LikeButton";
import { getSinglePage } from "../../api/page";
const SingleRequest = ({ data }) => {
  const router = useRouter();
  const [values, setValues] = useState({
    error: false,
    success: false,
    loading: false,
    comments: [],
    content: "",
    createCommentError: "",
    isLiked: false,
    feature: "",
    skip: 0,
    limit: 4,
    hasMore: true,
  });
  // const [comments, setComments] = useState([]);
  const {
    loading,
    error,
    success,
    content,
    comments,
    createCommentError,
    isLiked,
    feature,
    skip,
    limit,
    hasMore,
  } = values;
  const [hydrated, setHydrated] = useState(false);
  const token = getCookie("token");
  // useEffect(() => {
  //   singleFeature();
  //   setTimeout(() => {
  //     getComments();
  //   }, 1000);
  // }, [data]);

  const singleFeature = () => {
    console.log(data);

    const slug = data.slug;
    console.log("slug =", slug);
    getSingleFeature(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
        setValues({ ...values });
      } else {
        setValues({ ...values, feature: data, isLiked: data.isLiked });
      }
    });
  };
  const getComments = () => {
    // console.log(data.slug);
    const featureId = feature._id;
    getAllComments(featureId, token, skip, limit).then((data) => {
      console.log(featureId);
      if (data.error) {
        console.log(data.error);
        setValues({ ...values, commentError: data.error });
      } else {
        setValues({ ...values, comments: data });
      }
    });
  };
  // const singlePage = () =>{
  //   getSinglePage()
  // }
  useEffect(() => {
    if (feature && feature._id) getComments();
  }, [feature]);

  useEffect(() => {
    // console.log("data", data._id);
    // singlePage()
    singleFeature();

    // getComments();
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }

  // const token = getCookie("token");
  const deleteConfirm = (slug) => {
    let answer = window.confirm("are you sure you want to delete your blog?");
    if (answer) {
      deleteFeatureRequest(slug);
    }
  };
  const deleteFeatureRequest = (slug) => {
    setValues({ ...values, loading: true });
    deleteFeature(slug, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
        console.log(data.error);
      } else {
        setValues({ ...values, success: data.message, loading: false });
        setTimeout(() => {
          return router.push("/");
        }, 1000);
      }
    });
  };
  const showLoading = () => {
    return loading ? <Spinner color="primary">Loading...</Spinner> : "";
  };
  const showError = () => {
    return error ? <Alert color="danger">{error}</Alert> : "";
  };
  const showSuccess = () => {
    return success ? <Alert color="success">{success}</Alert> : "";
  };
  const showFeature = (feature) => {
    if (!feature || !feature.postedBy) {
      console.log(feature);
      return "Not Found";
    }
    const handleAddComment = (e) => {
      e.preventDefault();
      if (!isAuth()) {
        return router.push("/signin");
      }

      if (!content || content.length < 1) {
        console.log("batao bahiya");
        return setValues({
          ...values,
          createCommentError: "Comment is required",
        });
      }
      if (content.length > 100) {
        return setValues({
          ...values,
          createCommentError: "Comment Should be less than 100",
        });
      }
      const featureId = feature._id;
      const commentContent = { content };
      makeComment(commentContent, token, featureId).then((data) => {
        if (data.error) {
          console.log(data.error);
          setValues({ ...values, commentError: data.error });
        } else {
          let newData = data;
          newData.postedBy = isAuth();
          const tempComments = comments;
          tempComments.unshift(newData);
          setValues({ ...values, comments: tempComments, content: "" });
        }
      });
    };
    // BINA REDUX -
    // const removeCommentFromArray = (comment) => {
    //   // comment ko kaise bhi pakad sakte hai, either c or any var
    //   // let commentsArray = comments;    // commentsArray.filter()
    //   const index = comments.indexOf(comment);
    //   // index- kaha se remove karna hai, aur kaha tak
    //   comments.splice(index, 1);
    //   setValues({ ...values, comments: comments });
    // };

    // const updateSingleComment = (comment, editedComment) => {
    //   // kaise kaam kara?
    //   console.log("before", comments);
    //   const index = comments.indexOf(comment);
    //   // console.log(index);
    //   if (index !== -1) {
    //     comments[index].content = editedComment.content;
    //     // console.log(comments[index].content);
    //     console.log("after", comments);
    //   }
    // };

    // const updateSingleComment = (comment, editedComment) => {
    //   // kaise kaam kara
    //   // const tempComments = comments;
    //   // console.log(comment);
    //   // console.log(editedComment);
    //   console.log("before", comments);
    //   const index = comments.indexOf(comment);
    //   // console.log(index);
    //   if (index !== -1) {
    //     comments[index].content = editedComment.content;
    //     // console.log(comments[index].content);
    //     console.log("after", comments);
    //   }
    // };
    // const updateCommentsArray = (comment) => {
    //   // comment ko kaise bhi pakad sakte hai, either c or any var
    //   // commentsArray.filter()
    //   let commentsArray = comments;
    //   const index = commentsArray.indexOf(comment);
    //   console.log(index);
    //   // index- kaha se remove karna hai, aur kaha tak
    //   commentsArray.splice(index, 1);
    //   setValues({ ...values, comments: commentsArray });

    //   console.log(commentsArray);
    // };
    const mapComments = () => {
      return comments.map((c, i) => {
        return (
          <div key={i}>
            {/* c={c} ye single comment de rhe aur
             updateCommentsArray mei deleted/edited comment le rhe */}
            <SingleComment
              //jis name se props bhejo whi name se child mei pakdo jabki
              //parent jab pakdega child se to kaise bhi value lo
              comment={c}
              removeCommentFromArray={(comment) => {
                const index = comments.indexOf(comment);
                comments.splice(index, 1);
                setValues({ ...values, comments: comments });
              }}
              updateSingleComment={(comment, editedComment) => {
                const index = comments.indexOf(comment);
                if (index !== -1) {
                  comments[index].content = editedComment.content;
                  console.log("after", comments);
                }
              }}
            />
          </div>
        );
      });
    };
    const loadMoreComment = () => {
      let toSkip = skip + limit;
      const featureId = feature._id;
      getAllComments(featureId, token, toSkip, limit).then((data) => {
        console.log("toSkip", toSkip);
        if (data.error) {
          console.log(data.error);
          setValues({ ...values, commentError: data.error });
        } else {
          // let tempComments = [];
          // tempComments = [...comments, ...data];
          let tempComments = [...comments, ...data];

          // alert(`${data.length} ${limit}`);
          setValues({
            ...values,
            comments: tempComments,
            skip: toSkip,
            hasMore: !(data.length < limit),
          });
          console.log(comments.length);
        }
      });
    };
    return (
      <Container>
        <Col sm={12} className="mt-4">
          <div className="col-10 text-center">
            {showLoading()}
            {showSuccess()}
            {showError()}
          </div>
          <Card body>
            <CardTitle tag="h5">{feature.title}</CardTitle>
            <CardText>{feature.description}</CardText>
            <CardText>
              <p className="lead mark mt-2">
                {" "}
                Posted by {""}
                <Link href={`/user/${feature.postedBy.username}`}>
                  {feature.postedBy.username} {""}
                </Link>
                on {new Date(feature.createdAt).toDateString()}
              </p>
              <p>
                {/* <FcLike onClick={handleLike} size={35} /> */}
                {isAuth() &&
                  feature.postedBy &&
                  feature.postedBy._id !== isAuth()._id && (
                    <LikeButton
                      id={feature._id}
                      type="wallpaper"
                      isLiked={isLiked}
                      handleUpdate={(value) => {
                        setValues({ ...values, isLiked: value });
                      }}
                    />
                  )}
              </p>
            </CardText>
            {isAuth() &&
              feature.postedBy &&
              isAuth()._id === feature.postedBy._id && (
                <div className="d-flex mt-2">
                  <Update buttonLabel="Edit Feature" className={`mr-2`} />

                  <Button
                    color="danger"
                    size="sm"
                    className="mr-2 "
                    onClick={() => deleteConfirm(feature.slug)}
                  >
                    Delete Feature
                  </Button>
                </div>
              )}
          </Card>
          <div className="mt-5">
            <h3>Leave a comment</h3>
            <div className="mt-4">
              <FormGroup>
                <Input
                  type="text"
                  // className="input-big"
                  placeholder="Comment Something..."
                  value={content}
                  invalid={createCommentError}
                  onChange={(e) =>
                    //  console.log(e.target.value)
                    setValues({
                      ...values,
                      content: e.target.value,
                      createCommentError: "",
                    })
                  }
                />
                {createCommentError && (
                  <FormFeedback>{createCommentError}</FormFeedback>
                )}
                {/* WORK ON THIS */}
                {/* {commentError ? (
                  <FormFeedback invalid>{commentError}</FormFeedback>
                ) : (
                  <FormFeedback valid>
                    Sweet! that name is available
                  </FormFeedback>
                )} */}
              </FormGroup>

              <Button
                onClick={handleAddComment}
                color="primary"
                size="sm"
                className="mt-2"
              >
                Add Comment
              </Button>
            </div>
            <div className="my-4 mx-2">
              <p>{comments.length} comments</p>
              <hr />
              {mapComments()}
              {/* <div className="d-flex justify-content-center"> */}
              {comments && comments.length >= 4 && hasMore && (
                <Button
                  className="mx-auto d-flex mb-5"
                  color="primary"
                  size="sm"
                  onClick={loadMoreComment}
                >
                  Load More
                </Button>
              )}
              {/* {comments.length >= limit && (
                <Button
                  // className="mx-auto"
                  color="primary"
                  size="sm"
                  onClick={loadMore}
                >
                  Load More
                </Button>
              )} */}
              {/* </div> */}
            </div>

            {/* <Comment comments={comments} /> */}
          </div>
        </Col>
      </Container>
    );
  };
  return (
    <React.Fragment>
      <Layout singlePage={data.page} slug={data.slug}>
        {showFeature(feature)}
      </Layout>
    </React.Fragment>
  );
};

export default SingleRequest;

export async function getServerSideProps(context) {
  const { slug } = context.query;
  if (!slug) {
    return {
      props: { data: null },
    };
  }
  let result = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/feature/${slug}`);
    result = await res.json();
  } catch (error) {
    return {
      props: { data: null },
    };
  }
  return {
    props: { data: result },
  };
}
