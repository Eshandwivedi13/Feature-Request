import React from "react";
import Header from "../Header";
import Navbar from "../Navbar";

const PageLayout = ({ children, singlePage, slug, username }) => {
  return (
    <div className="">
      <Header singlePage={singlePage} slug={slug} />
      <Navbar singlePage={singlePage} slug={slug} username={username} />
      {children}
    </div>
  );
};

export default PageLayout;
