import React, { useState, useEffect } from "react";
import { FaYoutube } from "react-icons/fa";
import { getCookie, isAuth } from "../../api/auth";
import { useRouter } from "next/router";
import { Button } from "reactstrap";
import EditPage from "../Page/EditPage";
import { deletePage } from "../../api/page";
const Header = ({ singlePage, slug }) => {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const token = getCookie("token");
  useEffect(() => {
    setHydrated(true);
    // getPage();
  }, []);
  if (!hydrated) {
    return null;
  }
  console.log(singlePage);
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
  const authorizedContent = () => {
    if (router.asPath === `/pages/${slug}`) {
      return (
        <React.Fragment>
          <h1 className="d-flex align-items-center mb-3">
            {/* <FaYoutube color="red" />{" "} */}
            <span className="" style={{ overflowWrap: "anywhere" }}>
              {singlePage.title}
            </span>
          </h1>

          <p style={{ overflowWrap: "anywhere" }}>{singlePage.description}</p>
          {slug && singlePage.postedBy === isAuth()._id && (
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
          <h1 className="d-flex align-items-center mb-3">
            {/* <FaYoutube color="red" />{" "} */}
            <span className="">Feature Request App</span>
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
      router.asPath === `/signup`
    ) {
      return (
        <React.Fragment>
          <h1 className="d-flex align-items-center mb-3">
            <span className="">Feature Request</span>
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
