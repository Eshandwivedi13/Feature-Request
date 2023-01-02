import React from "react";
import Header from "../Header";
import Navbar from "../Navbar";

const PageLayout = ({ children, singlePage, slug, username, search }) => {
  return (
    <div className="">
      <Header singlePage={singlePage} slug={slug} searched={search} />
      <Navbar
        singlePage={singlePage}
        slug={slug}
        username={username}
        searched={search}
      />
      {children}
    </div>
  );
};

export default PageLayout;
