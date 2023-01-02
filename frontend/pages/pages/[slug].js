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
import {
  deleteFeature,
  getAllFeaturesOfPage,
  getSingleFeature,
  voteFeature,
} from "../../api/feature";
import Update from "../../components/Feature/Update";
import { makeComment, getAllComments } from "../../api/comment";
import Comment from "../../components/Comments/Comment";
import SingleComment from "../../components/Comments/SingleComment";
import LikeButton from "../../components/Misc/LikeButton";
import { getSinglePage } from "../../api/page";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const SinglePage = ({ pageFromSSR }) => {
  const router = useRouter();
  const [values, setValues] = useState({
    features: [],
    error: false,
    success: false,
    loading: false,
    comments: [],
    content: "",
    commentError: false,
    isLiked: false,
    feature: "",
    skip: 0,
    limit: 5,
    hasMore: true,
  });
  // const [comments, setComments] = useState([]);
  const {
    loading,
    error,
    success,
    content,
    comments,
    commentError,
    isLiked,
    feature,
    skip,
    limit,
    hasMore,
    features,
  } = values;
  const [hydrated, setHydrated] = useState(false);
  const token = getCookie("token");
  useEffect(() => {
    // setValues({ ...values, features: features });
    // singlePage();
    listFeatures();
  }, []);

  // const singlePage = () => {
  //   const slug = page.slug;
  //   getSinglePage(slug, token).then((data) => {
  //     if (data.error) {
  //       console.log(error);
  //     } else {
  //       console.log(data);
  //       setValues({
  //         ...values,
  //         page: data.pageFound,
  //         // hasMore: !(data.length < limit),
  //         // votesCount: data.votesCount,
  //         // isLiked: data.isLiked,
  //       });
  //     }
  //   });
  // };
  const listFeatures = () => {
    const pageId = pageFromSSR._id;
    getAllFeaturesOfPage(skip, limit, token, pageId).then((data) => {
      if (data.error) {
        console.log(error);
      } else {
        setValues({
          ...values,
          features: data,
          isLiked: data.isLiked,
          hasMore: !(data.length < limit),
          // votesCount: data.votesCount,
          // isLiked: data.isLiked,
        });
      }
    });
  };
  const FeatureRequest = ({
    title,
    excerpt,
    votesCount,
    slug,
    createdAt,
    postedBy,
    Liked,
    featureId,
  }) => {
    const [isLiked, setIsLiked] = useState(Liked);

    const [count, setCount] = useState(votesCount);
    const handleClick = () => {
      if (!isAuth()) {
        router.push("/signin");
      } else if (postedBy._id !== isAuth()._id) {
        console.log("tests");
        setCount(isLiked ? count - 1 : count + 1);

        setIsLiked(!isLiked);
        voteFeature(featureId, token).then((data) => {
          if (data.error) {
            console.log(data.error);
          } else if (data.success === true) {
            setIsLiked(true);
          } else if (data.success === false) {
            setIsLiked(false);
          }
        }); // todo-
      } else if (postedBy._id === isAuth()._id) {
        console.log("error, cannot vote on self feature");
      }
    };
    return (
      <div className="d-flex justify-content-between px-lg-5">
        <div className="pr-5">
          <Link href={`/feature/${slug}`} className=" white-link">
            {title}
          </Link>
          <p
            className="text-muted "
            style={{ fontSize: "95%", overflowWrap: "anywhere" }}
          >
            {excerpt}
          </p>
          <p className="mark">
            Requested by {""}
            <Link className="" href={`/profile/${postedBy.username}`}>
              {postedBy.username}
            </Link>
            {""} Published on {new Date(createdAt).toDateString()}
          </p>
        </div>
        <div>
          <Button
            color="white"
            style={{
              border: isLiked ? "3px solid #dedede" : "4px solid transparent",
            }}
            className={`shadow text-muted d-inline-flex align-items-center`}
            // onClick={() => {

            //   setCount(isLiked ? count - 1 : count + 1);
            //   setIsLiked(!isLiked);
            // }}
            onClick={handleClick}
          >
            {isLiked ? <FaCaretUp /> : <FaCaretDown />}
            <span className="ml-1">{count}</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderFeatures = () => {
    return features.map((f, i) => {
      return (
        <div className="px-5 py-4" key={i}>
          <FeatureRequest
            title={f.title}
            excerpt={f.excerpt}
            votesCount={f.votesCount}
            slug={f.slug}
            createdAt={f.createdAt}
            postedBy={f.postedBy}
            Liked={f.isLiked}
            featureId={f._id}
          />
        </div>
      );
    });
  };
  const fetchMoreData = () => {
    console.log("test");
    const pageId = pageFromSSR._id;
    let toSkip = skip + limit;
    getAllFeaturesOfPage(toSkip, limit, token, pageId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(typeof data, "?");
        const tempArray = [...features, ...data];
        console.log(features.length);
        setValues({
          ...values,
          skip: toSkip,
          features: tempArray,
          hasMore: !(data.length < limit),
        });
      }
    });
  };

  return (
    <React.Fragment>
      {/* <Layout>{showFeature(feature)}</Layout> */}
      <Layout singlePage={pageFromSSR} slug={pageFromSSR.slug}>
        {features.length ? (
          <InfiniteScroll
            dataLength={features.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            {renderFeatures()}
          </InfiniteScroll>
        ) : (
          <div className="jumbotron d-flex justify-content-center">
            <p className="lead">
              Currently, No feature is there!
              <br /> <span className="ml-3">Suggest Some features!</span>
            </p>
          </div>
        )}
      </Layout>
    </React.Fragment>
  );
};

export default SinglePage;

export async function getServerSideProps(context) {
  const { slug } = context.query;
  if (!slug) {
    return {
      props: { data: null },
    };
  }
  let result = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/page/${slug}`);
    result = await res.json();
  } catch (error) {
    return {
      props: { data: null },
    };
  }
  return {
    props: {
      pageFromSSR: result,
    },
  };
}
