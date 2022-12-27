import React, { useState, useEffect } from "react";
import { withRouter, useRouter } from "next/router";
import { getAllFeature } from "../../api/feature";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "reactstrap";
import Link from "next/link";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { getCookie, isAuth } from "../../api/auth";
import { voteFeature } from "../../api/feature";

//vote Count banana hai

const Read = () => {
  const token = getCookie("token");
  const router = useRouter();
  useEffect(() => {
    listFeatures();
  }, []);

  const [values, setValues] = useState({
    features: [],
    limit: 5,
    hasMore: true,
    skip: 0,
  });

  const { limit, features, hasMore, skip } = values;
  const listFeatures = () => {
    alert("Running Init");
    getAllFeature(skip, limit, token).then((data) => {
      if (data.error) {
        console.log(error);
      } else {
        console.log(data);
        setValues({
          ...values,
          features: data,
          hasMore: !(data.length < limit),
          // votesCount: data.votesCount,
          // isLiked: data.isLiked,
        });
      }
    });
  };
  //   const input = () => {
  //     <React.Fragment>
  //       {/* <label for="checkbox">
  //       <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
  //         <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
  //           <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2"/>
  //           <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/>

  //           <g id="grp7" opacity="0" transform="translate(7 6)">
  //             <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
  //             <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
  //           </g>

  //           <g id="grp6" opacity="0" transform="translate(0 28)">
  //             <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
  //             <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
  //           </g>

  //           <g id="grp3" opacity="0" transform="translate(52 28)">
  //             <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
  //             <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
  //           </g>

  //           <g id="grp2" opacity="0" transform="translate(44 6)">
  //             <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
  //             <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
  //           </g>

  //           <g id="grp5" opacity="0" transform="translate(14 50)">
  //             <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
  //             <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
  //           </g>

  //           <g id="grp4" opacity="0" transform="translate(35 50)">
  //             <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
  //             <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
  //           </g>

  //           <g id="grp1" opacity="0" transform="translate(24)">
  //             <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
  //             <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
  //           </g>
  //         </g>
  //       </svg>
  //       </label> */}
  //       {/* import React, {useState} from "react";
  // import { Spring, animated as a } from 'react-spring/renderprops';

  // const SpringButton = () => {
  //   const [pressed, setPressed] = useState(false);
  //   return (
  //   <Spring native from={{scale: 1}} to={{scale: pressed? 0.8 : 1}}>
  //     {({scale}) => (
  //       <a.button
  //         style={{
  //           backgroundColor: 'red',
  //           height: '100px',
  //           width: '100px',
  //           color: 'rgb(255, 255, 255)',
  //           transform: scale.interpolate(scale => `scale(${scale})`)
  //           }}
  //         onMouseDown={() => setPressed(true)}
  //         onClick={() => setPressed(false)}
  //         onMouseLeave={() => setPressed(false)}
  //       >
  //         Click me
  //       </a.button>
  //     )}
  //   </Spring>
  //   );
  // } */}
  //     </React.Fragment>;
  //   };
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
        dataLength={features.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {renderFeatures()}
      </InfiniteScroll>
    </React.Fragment>
  );
};

export default Read;
