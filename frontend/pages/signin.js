import React, { useState, useEffect } from "react";
import { isAuth } from "../api/auth";
import Signin from "../components/auth/Signin";
import Layout from "../components/Layout";
import Router from "next/router";

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
        <Signin />
      </Layout>
    </React.Fragment>
  );
};

export default signin;
