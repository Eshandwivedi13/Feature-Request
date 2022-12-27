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
import { getAllFeaturesFromUser } from "../../api/feature";
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
    error: "",
    hasMorePages: false,
    hasMoreFeatures: true,
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
        setValues({ ...values, pages: data });
      }
    });
  };
  const getFeatures = () => {
    getAllFeaturesFromUser(featureSkip, featureLimit, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, features: data });
      }
    });
  };
  // useEffect(() => {
  //   // if (pages && pages.length > 0)
  //   console.log("getFeatures");
  //   getFeatures();
  // }, []);

  useEffect(() => {
    getPages();
    getFeatures();
    // async () => {
    //   console.log("?");
    //   {
    //     try {
    //       await getPages();
    //       await getFeatures();
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // };
    console.log("getPages");
    // }, [getPages, getFeatures]);
  }, []);

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
            {mapPages()}
            {isAuth() && pages.length >= 4 && !hasMorePages && (
              <Button
                className="mt-4 d-flex mx-auto"
                color="primary"
                onClick={loadMorePages}
              >
                Load More
              </Button>
            )}
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
            {mapFeatures()}
            {isAuth() && features.length >= 4 && hasMoreFeatures && (
              <Button
                className="my-4 d-flex mx-auto"
                color="primary"
                onClick={loadMoreFeatures}
              >
                Load More
              </Button>
            )}
          </Col>
        </div>
      </div>
    );
  };
  return <React.Fragment>{pageContent()}</React.Fragment>;
};

// export default React.memo(HomePage);
export default HomePage;
