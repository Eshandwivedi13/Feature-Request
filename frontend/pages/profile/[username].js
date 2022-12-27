import React, { useState, useEffect } from "react";
import { Container, Button, Col, Card, CardTitle, CardText } from "reactstrap";
import { getCookie, isAuth } from "../../api/auth";
import Layout from "../../components/Layout";
import DefaultProfile from "../../public/images/profile.jpg";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import Private from "../../components/auth/Private";
import ContactUser from "../../components/Profile/ContactUser";
import { getAllPagesFromUser } from "../../api/page";
import { getAllFeaturesFromUser } from "../../api/feature";

const userProfile = ({ data }) => {
  // const { data, featuresFromDb } = data;
  const router = useRouter();
  const token = getCookie("token");
  const [hydrated, setHydrated] = useState(false);
  const [values, setValues] = useState({
    pages: [],
    features: [],
    pageSkip: 0,
    pageLimit: 5,
    featureSkip: 0,
    featureLimit: 5,
    hasMorePages: false,
    hasMoreFeatures: true,
    error: false,
  });
  const {
    pages,
    features,
    pageSkip,
    pageLimit,
    featureSkip,
    featureLimit,
    error,
    hasMorePages,
    hasMoreFeatures,
  } = values;
  const populatePagesFeatures = () => {
    return new Promise(async (res, rej) => {
      try {
        let pages;
        let features;
        await getAllPagesFromUser(pageSkip, pageLimit, token).then((data) => {
          if (data.error) {
            console.log(data.error);
            return [];
          } else {
            pages = data;
          }
        });
        await getAllFeaturesFromUser(featureSkip, featureLimit, token).then(
          (data) => {
            console.log(data);
            if (data.error) {
              console.log(data.error);
              return [];
            } else {
              features = data;
            }
          }
        );
        const data = { pages, features };
        return res(data);
      } catch (error) {
        rej(error);
      }
    });
  };

  useEffect(() => {
    populatePagesFeatures()
      .then((data) => {
        setValues({ ...values, features: data.features, pages: data.pages });
      })
      .catch((error) => {
        console.log(error);
        setValues({ ...values, error: error });
      });
  }, []);

  useEffect(() => {
    setHydrated(true);
    // console.log(data);
  }, []);
  if (!hydrated) {
    return null;
  }
  const FeatureRequest = ({
    title,
    excerpt,
    slug,

    // voteCount,
    // createdAt,
    // postedBy,
  }) => {
    // const [isLiked, setIsLiked] = useState(false);

    // const [count, setCount] = useState(voteCount);

    return (
      <div className="d-flex justify-content-between px-lg-5">
        <div className="pr-5">
          <Link href={`/feature/${slug}`} className="mb-1 white-link">
            {title}
          </Link>
          <p
            className="text-muted "
            style={{ fontSize: "95%", overflowWrap: "anywhere" }}
          >
            {excerpt}
          </p>
        </div>
      </div>
    );
  };
  // const renderFeatures = () => {
  //   // return featuresFromDb.map((f, i) => {
  //   //   // const posterName = r.postedBy ? r.postedBy.name : ""
  //   //   return (
  //   //     <div className="px-5 py-4" key={i}>
  //   //       <FeatureRequest
  //   //         title={f.title}
  //   //         excerpt={f.excerpt}
  //   //         slug={f.slug}
  //   //         // voteCount={98}
  //   //         // createdAt={f.createdAt}
  //   //         // postedBy={f.postedBy}
  //   //       />
  //   //     </div>
  //   //   );
  //   // });
  // };
  const mapPages = () => {
    return pages.map((p, i) => {
      return (
        <div key={i} className="my-4">
          <Card body className="manual-card">
            <CardTitle tag="h5">{p.title}</CardTitle>
            <CardText>{p.excerpt}</CardText>
            <Button color="primary" size="sm" className="w-50">
              <Link href={`/pages/${p.slug}`}>Go To Page</Link>
            </Button>
          </Card>
        </div>
      );
    });
  };

  const loadMorePages = () => {
    // manke chalte hai aur data nhi h, hasMorePages false hai to loadmore dikhega
    const toSkip = pageSkip + pageLimit;
    console.log("toSkip", toSkip, "toLimit", pageLimit, "skip value", pageSkip);
    getAllPagesFromUser(toSkip, pageLimit, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("data aya onLoadMore");
        const tempArray = [...pages, ...data];
        setValues({
          ...values,
          pages: tempArray,
          pageSkip: toSkip,
          hasMorePages: !(data.length >= pageLimit),
        });
      }
    });
  };

  const mapFeatures = () => {
    return features.map((f, i) => {
      return (
        <div key={i} className="mt-4">
          <Card body className="manual-card">
            <CardTitle tag="h5">{f.title}</CardTitle>
            <CardText>{f.excerpt}</CardText>
            <Button color="primary" size="sm" className="w-50">
              <Link href={`/feature/${f.slug}`}>Go To Feature</Link>
            </Button>
          </Card>
        </div>
      );
    });
  };
  const loadMoreFeatures = () => {
    const toSkip = featureSkip + featureLimit;
    getAllFeaturesFromUser(toSkip, featureLimit, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("data aya onLoadMore");
        const tempArray = [...features, ...data];
        setValues({
          ...values,
          features: tempArray,
          featureSkip: toSkip,
          hasMoreFeatures: !(data.length < featureLimit),
        });
      }
    });
  };

  const pageContent = () => {
    return (
      <div className="mt-5 mx-5 ">
        <div className="d-flex justify-content-between">
          <Col sm="6" lg="5">
            <p className="lead">Your Pages</p>
            {!pages.length && <p className="lead">No Pages Yet!</p>}

            <div>
              {mapPages()}
              {pages.length >= 4 && !hasMorePages && (
                <Button
                  className="my-4 d-flex mx-auto"
                  color="primary"
                  onClick={loadMorePages}
                >
                  Load More
                </Button>
              )}
              <div className="my-4">
                {hasMorePages && (
                  <p className="text-center">Yea, You have Seen it All!</p>
                )}
              </div>
            </div>
          </Col>
          <Col sm="6" lg="5">
            <p className="lead">Your Features</p>
            <div>
              {mapFeatures()}
              {features.length >= 4 && hasMoreFeatures && (
                <Button
                  className="my-4 d-flex mx-auto"
                  color="primary"
                  onClick={loadMoreFeatures}
                >
                  Load More
                </Button>
              )}
              <div className="my-4">
                {!hasMoreFeatures && (
                  <p className="text-center">Yea, You have Seen it All!</p>
                )}
              </div>
            </div>
          </Col>
        </div>
      </div>
    );
  };
  const profileContent = () => {
    return (
      <Container className="mt-5">
        <div className="d-flex ">
          <div className="p-4">
            <img
              // style={{ height: " 60%", borderRadius: "6px", width: "auto" }}
              style={{
                height: " 256px",
                borderRadius: "7px",
                width: "256px",
                objectFit: "cover",
              }}
              src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA14dHoX.img?w=612&h=408&m=6&x=297&y=139&s=355&d=355"
              alt={data.username}
              onError={(i) => (i.target.src = `${DefaultProfile}`)}
              // const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile
            />
          </div>
          <div className="p-4 w-50 ">
            <h2 className="mb-3"> @{data.username}</h2>
            {/* <p className="lead">8 Requests...</p> */}
            <p className="lead">bio: {data.bio}</p>
            {isAuth() && data && isAuth()._id === data._id ? (
              <Button
                color="primary"
                onClick={() => {
                  router.push(`/profile/edit`);
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <ContactUser buttonLabel="Contact" />
            )}
          </div>
        </div>
        <div className="mt-5">{pageContent()}</div>
      </Container>
    );
  };
  return (
    <React.Fragment>
      <Layout username={data.username}>
        <Private>{profileContent()} </Private>
      </Layout>
    </React.Fragment>
  );
};

export default userProfile;

export async function getServerSideProps(context) {
  const { username } = context.query;
  // console.log(slug);
  if (!username) {
    return {
      props: { data: null },
    };
  }
  let result = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/profile/${username}`
    );
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
