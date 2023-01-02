import React from "react";
import { Button, Card, CardText, CardTitle, Col, Container } from "reactstrap";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { searchData } from "../../api/page";
import { getCookie } from "../../api/auth";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
const SearchPage = ({ data }) => {
  const [values, setValues] = useState({
    pages: [],
    skip: 0,
    limit: 5,
    hasMore: true,
  });
  const { pages, skip, limit, hasMore } = values;
  const router = useRouter();
  const token = getCookie("token");
  const getSearchedData = async () => {
    console.log(hasMore);
    await setValues({ ...values, skip: 0, limit: 5, hasMore: true });

    const search = router.query.search;
    await searchData(search, skip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, pages: data, skip: 0 });
      }
    });
  };
  useEffect(() => {
    setValues({ ...values, skip: 0, limit: 5, hasMore: true });
    getSearchedData();
    console.log("UseEffect chal gya");
  }, [router.query.search]);

  useEffect(() => {}, [data]);

  const mapSearchData = () => {
    return pages.map((p, i) => {
      return (
        <div key={i} className="mt-4">
          <Card body className="manual-card">
            <CardTitle tag="h5">{p.title}</CardTitle>
            <CardText>{p.excerpt}</CardText>
            <Button color="primary" className="w-25" size="sm">
              <Link href={`/pages/${p.slug}`}>Go To Page</Link>
            </Button>
          </Card>
        </div>
      );
    });
  };
  const fetchMoreData = () => {
    console.log("Best");
    const search = router.query.search;
    let toSkip = skip + limit;
    searchData(search, toSkip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        const tempArray = [...pages, ...data];
        setValues({
          ...values,
          pages: tempArray,
          skip: toSkip,
          hasMore: !(data.length < limit),
        });
      }
    });
  };

  return (
    <Layout search={router.query.search}>
      <Container className="mt-5">
        <Col>
          {pages && pages.length ? (
            mapSearchData()
          ) : (
            <div className="">No Such Pages Present!</div>
          )}
          {hasMore && (
            <Button
              className="d-flex mx-auto my-4"
              color="primary"
              onClick={fetchMoreData}
            >
              Load More
            </Button>
          )}
        </Col>
        ;
      </Container>
    </Layout>
    // <Layout search={router.query.search}>
    //   {pages && pages.length ? (
    //     <InfiniteScroll
    //       dataLength={pages.length}
    //       next={fetchMoreData}
    //       hasMore={hasMore}
    //       loader={<h4>Loading...</h4>}
    //     >
    //       <Container className="my-5">
    //         <Col>
    //           {mapSearchData()}
    //           {!hasMore && (
    //             <p className="my-5 text-center">Yea you have seen it All!</p>
    //           )}
    //         </Col>
    //       </Container>
    //     </InfiniteScroll>
    //   ) : (
    //     <div className="jumbotron d-flex justify-content-center">
    //       <p className="lead">
    //         No Such Pages Present!
    //         <br /> <span className="ml-3">Add Some Pages!</span>
    //       </p>
    //     </div>
    //   )}
    // </Layout>
  );
};

export default SearchPage;

export async function getServerSideProps(context) {
  const { search } = context.query;
  // console.log(slug);
  if (!search) {
    return {
      props: { data: null },
    };
  }
  let result = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/pages/search/${search}`
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
