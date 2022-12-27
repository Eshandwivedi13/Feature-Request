import React, { useState, useEffect } from "react";
import { withRouter, useRouter } from "next/router";
import { getAllFeature } from "../../api/feature";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "reactstrap";
import Link from "next/link";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { getCookie, isAuth } from "../../api/auth";
import { voteFeature } from "../../api/feature";
import { getSinglePage } from "../../api/page";

//vote Count banana hai

const Read = () => {
  const token = getCookie("token");
  const router = useRouter();
  useEffect(() => {
    singlePage();
  }, []);

  const [values, setValues] = useState({
    pages: [],
    limit: 5,
    hasMore: true,
    skip: 0,
  });

  const { limit, pages, hasMore, skip } = values;
  const singlePage = () => {
    getSinglePage(token).then((data) => {
      if (data.error) {
        console.log(error);
      } else {
        console.log(data);
        setValues({
          ...values,
          pages: data,
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

  //   const renderFeatures = () => {
  //     return features.map((f, i) => {
  //       return (
  //         <div className="px-5 py-4" key={i}>
  //           <FeatureRequest
  //             title={f.title}
  //             excerpt={f.excerpt}
  //             votesCount={f.votesCount}
  //             slug={f.slug}
  //             createdAt={f.createdAt}
  //             postedBy={f.postedBy}
  //             Liked={f.isLiked}
  //             featureId={f._id}
  //           />
  //         </div>
  //       );
  //     });
  //   };
  const fetchMoreData = () => {
    let toSkip = skip + limit;
    getAllFeature(toSkip, limit).then((data) => {
      alert("Fetch More");
      if (data.error) {
        console.log(data.error);
      } else {
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
      <InfiniteScroll
        dataLength={pages.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      ></InfiniteScroll>
    </React.Fragment>
  );
};

export default Read;
