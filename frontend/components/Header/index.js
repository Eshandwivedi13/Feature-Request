import React, { useState, useEffect } from "react";
import { FaYoutube } from "react-icons/fa";
import { getCookie, isAuth } from "../../api/auth";
import { useRouter } from "next/router";
import {
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import EditPage from "../Page/EditPage";
import { deletePage } from "../../api/page";
import { Input } from "reactstrap";
import { AiOutlineSearch } from "react-icons/Ai";
import { MdOutlineSearch } from "react-icons/md";

const Header = ({ singlePage, slug, searched }) => {
  const [values, setValues] = useState({
    search: "",
    parentSkip: 0,
    parentLimit: 5,
    parentHasMore: true,
  });
  const { search, parentSkip, parentLimit, parentHasMore } = values;
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const token = getCookie("token");
  useEffect(() => {
    setHydrated(true);
    // getPage();
    // setValues({ ...values, search: searched });
    console.log(searched);
  }, []);
  if (!hydrated) {
    return null;
  }
  const deleteConfirm = (slug) => {
    let answer = window.confirm("are you sure you want to delete your blog?");
    if (answer) {
      deleteSinglePage(slug);
    }
  };
  const deleteSinglePage = (slug) => {
    console.log(slug);
    deletePage(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        router.push("/");
      }
    });
  };
  const handleSubmit = () => {
    console.log("?");
    router.push(`/search/${search}`);
  };
  const authorizedContent = () => {
    if (router.asPath === `/pages/${slug}`) {
      return (
        <React.Fragment>
          <h1 className="d-flex align-items-center justify-content-between mb-3">
            {/* <FaYoutube color="red" />{" "} */}
            <span className="" style={{ overflowWrap: "anywhere" }}>
              {singlePage.title}
            </span>
            <div className="d-flex align-items-center">
              <Input
                className="search"
                placeholder="Search Something..."
                value={search}
                onChange={(e) => {
                  setValues({ ...values, search: e.target.value });
                }}
              />
              <AiOutlineSearch
                onClick={() => {
                  router.push(`/search/${search}`);
                }}
                size={25}
              />
            </div>
          </h1>

          <p style={{ overflowWrap: "anywhere" }}>{singlePage.description}</p>
          {singlePage.postedBy === isAuth()._id && (
            <div className="d-flex align-items-center">
              <EditPage buttonLabel={`Edit Page`} slug={singlePage.slug} />
              <Button
                size="sm"
                color="danger"
                onClick={() => deleteConfirm(slug)}
                className="ml-3"
              >
                Delete Page
              </Button>
            </div>
          )}
        </React.Fragment>
      );
    } else if (router.asPath === `/search/${searched}`) {
      return (
        <React.Fragment>
          <h1 className="d-flex align-items-center justify-content-between mb-3">
            {/* <FaYoutube color="red" />{" "} */}
            <span className="">Feature Request App</span>
            <form className="d-flex align-items-center" onSubmit={handleSubmit}>
              <Input
                className="search"
                placeholder="Search Something..."
                value={search}
                onChange={(e) => {
                  setValues({ ...values, search: e.target.value });
                }}
              />
              {/* <InputGroup>
                <Input
                  className="search"
                  placeholder="Search Something..."
                  value={search}
                  onChange={(e) => {
                    setValues({ ...values, search: e.target.value });
                  }}
                />
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="search">
                    <i className="mdi mdi-magnify"></i>
                    <MdOutlineSearch size={24} color="#7d7d7d" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup> */}

              <AiOutlineSearch
                onClick={() => {
                  router.push(`/search/${search}`);
                }}
                size={25}
              />
            </form>
          </h1>

          <p>
            {/* isAUth ka about me */}
            Let us know how we can improve our app. Vote on existing ideas or
            suggest new ones. Create your Own pages, features, comments and lot
            more!
          </p>
        </React.Fragment>
      );
    } else if (router.asPath === `/feature/${slug}`) {
      return (
        <div>
          <h1 className="d-flex align-items-center mb-3">
            {/* <FaYoutube color="red" />{" "} */}
            <span className="wrap-page" style={{ overflowWrap: "anywhere" }}>
              {singlePage.title}
            </span>
          </h1>

          <p style={{ overflowWrap: "anywhere" }}>{singlePage.description}</p>
          {/* <div className="d-flex align-items-center">
        <EditPage buttonLabel={`Edit Page`} slug={singlePage.slug} />
        <Button size="sm" color="danger" className="ml-3">
          Delete Page
        </Button>
      </div> */}
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <h1 className="d-flex align-items-center justify-content-between mb-3">
            {/* <FaYoutube color="red" />{" "} */}
            <span className="">Feature Request App</span>
            <div className="d-flex align-items-center">
              <Input
                className="search"
                placeholder="Search Something..."
                value={search}
                onChange={(e) => {
                  setValues({ ...values, search: e.target.value });
                }}
              />
              <AiOutlineSearch
                onClick={() => {
                  router.push(`/search/${search}`);
                }}
                size={25}
              />
            </div>
          </h1>

          <p>
            {/* isAUth ka about me */}
            Let us know how we can improve our app. Vote on existing ideas or
            suggest new ones. Create your Own pages, features, comments and lot
            more!
          </p>
        </React.Fragment>
      );
    }
  };

  const unauthorizedContent = () => {
    if (
      router.asPath === `/` ||
      router.asPath === `/signin` ||
      router.asPath === `/signup` ||
      router.asPath === `/search/${searched}`
    ) {
      return (
        <React.Fragment>
          <h1 className="d-flex align-items-center mb-3 justify-content-between">
            <span className="">Feature Request</span>
            <div className="d-flex align-items-center">
              <Input
                className="search"
                placeholder="Search Something..."
                value={search}
                onChange={(e) => {
                  setValues({ ...values, search: e.target.value });
                }}
              />
              <AiOutlineSearch
                onClick={() => {
                  router.push(`/search/${search}`);
                }}
                size={25}
              />
            </div>
          </h1>

          <p>Your Suggestion Matters</p>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <h1 className="d-flex align-items-center mb-3">
            {/* <FaYoutube color="red" />{" "} */}
            <span className="" style={{ overflowWrap: "anywhere" }}>
              {singlePage.title}
            </span>
          </h1>

          <p style={{ overflowWrap: "anywhere" }}>{singlePage.description}</p>
        </React.Fragment>
      );
    }
  };
  // const mainContent = () => {
  //   if (singlePage && singlePage.description.length < 450) {
  //     return (
  //       <header
  //         className="px-5 py-5"
  //         style={{
  //           backgroundImage: "linear-gradient(to right,#fee5bc, #fdcb7b)",
  //         }}
  //       >
  //         {authorizedContent()}
  //       </header>
  //     );
  //   } else if (singlePage) {
  //     return (
  //       <header
  //         className="px-5 py-4"
  //         style={{
  //           backgroundImage: "linear-gradient(to right,#fee5bc, #fdcb7b)",
  //         }}
  //       >
  //         {authorizedContent()}
  //       </header>
  //     );
  //   } else {
  //     // index, profile page wala content
  //     return (
  //       <header
  //         className="px-5 py-5"
  //         style={{
  //           backgroundImage: "linear-gradient(to right,#fee5bc, #fdcb7b)",
  //         }}
  //       >
  //         {authorizedContent()}
  //       </header>
  //     );
  //   }
  // };

  return (
    <header
      className="px-5 py-5"
      style={{
        backgroundImage: "linear-gradient(to right,#fee5bc, #fdcb7b)",
        // overflowWrap: "anywhere",
      }}
    >
      {isAuth() ? authorizedContent() : unauthorizedContent()}
    </header>

    // <React.Fragment>
    //   {" "}
    //   {isAuth() ? (
    //     mainContent()
    //   ) : (
    //     <header
    //       className="px-5 py-5"
    //       style={{
    //         backgroundImage: "linear-gradient(to right,#fee5bc, #fdcb7b)",
    //       }}
    //     >
    //       {unauthorizedContent()}
    //     </header>
    //   )}
    // </React.Fragment>
  );
};

export default Header;
