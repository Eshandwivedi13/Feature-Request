import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
  Container,
} from "reactstrap";
import { getAllPagesFromUser, getAllPages } from "../../api/page";
import { getCookie, isAuth } from "../../api/auth";
import Link from "next/link";
import { getAllFeaturesFromUser, getAllFeatures } from "../../api/feature";
import { useRouter } from "next/router";
const HomePage = () => {
  // const router = useRouter();
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
  const token = getCookie("token");
  const getPages = async () => {
    await getAllPagesFromUser(pageSkip, pageLimit, token).then((data) => {
      if (data.error) {
        console.log(data.error);
        setValues({ ...values, error: data.error });
      } else {
        setValues((prev) => ({ ...prev, pages: data }));
      }
    });
  };
  const getFeatures = () => {
    getAllFeaturesFromUser(featureSkip, featureLimit, token).then((data) => {
      if (data.error) {
        console.log(data.error);
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        setValues((prev) => ({ ...prev, features: data }));
      }
    });
  };

  // const getPages = async () => {
  //   await getAllPagesFromUser(pageSkip, pageLimit, token).then((data) => {
  //     if (data.error) {
  //       console.log(data.error);
  //     } else {
  //       setValues({ ...values, pages: data });
  //     }
  //   });
  // };
  // const getFeatures = () => {
  //   getAllFeaturesFromUser(featureSkip, featureLimit, token).then((data) => {
  //     if (data.error) {
  //       console.log(data.error);
  //     } else {
  //       setValues({ ...values, features: data });
  //     }
  //   });
  // };

  const populatePagesFeatures = () => {
    return new Promise(async (res, rej) => {
      try {
        let pages;
        let features;
        await getAllPages(pageSkip, pageLimit).then((data) => {
          if (data.error) {
            console.log(data.error);
            return [];
          } else {
            pages = data;
          }
        });
        await getAllFeatures(featureSkip, featureLimit).then((data) => {
          if (data.error) {
            console.log(data.error);
            return [];
          } else {
            features = data;
          }
        });
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

  // useEffect(() => {
  //   getFeatures();
  //   console.log("featFeatures");
  // }, []);
  // useEffect(() => {
  //   getPages();
  //   console.log("getPages");
  // }, []);

  const mapPages = () => {
    return pages.map((p, i) => {
      return (
        <div key={i} className="my-4">
          <Card body className="manual-card">
            <CardTitle tag="h5">{p.title}</CardTitle>
            <CardText>{p.excerpt}</CardText>
            <Button color="primary" size="sm" className="w-25">
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
    getAllPages(toSkip, pageLimit).then((data) => {
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
            <Button color="primary" size="sm" className="w-25">
              <Link href={`/feature/${f.slug}`}>Go To Feature</Link>
            </Button>
          </Card>
        </div>
      );
    });
  };
  const loadMoreFeatures = () => {
    const toSkip = featureSkip + featureLimit;
    getAllFeatures(toSkip, featureLimit).then((data) => {
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
            <p className="lead">Pages</p>
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

          {/* <Col sm="6" lg="5">
            {pages.map((p, i) => {
              <div key={i}>
                <Card body>
                  <CardTitle tag="h5">{p.title}</CardTitle>
                  <CardText>{p.excerpt}</CardText>
                  <Button color="primary" size="sm" className="w-25">
                    <Link href={`/pages/${p.slug}`}>Go To Page</Link>
                  </Button>
                </Card>
              </div>;
            })}
          </Col> */}

          <Col sm="6" lg="5">
            <p className="lead">Features</p>
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
  return <React.Fragment>{pageContent()}</React.Fragment>;
};

// export default React.memo(HomePage);
export default HomePage;
