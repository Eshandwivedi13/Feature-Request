import React, { useState, useEffect } from "react";
import Signup from "../components/auth/Signup";
import Layout from "../components/Layout";
import Router from "next/router";
import { isAuth } from "../api/auth";

const signin = () => {
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    if (isAuth()) {
      Router.push("/");
    }

    setIsAuthorized(isAuth() ? true : false);
  }, []);

  return isAuthorized ? null : (
    <React.Fragment>
      <Layout>
        <Signup />
      </Layout>
    </React.Fragment>
  );
};

export default signin;
