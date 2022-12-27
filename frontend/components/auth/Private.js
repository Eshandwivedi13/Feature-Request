import React, { useEffect, useState } from "react";
import { isAuth } from "../../api/auth";
import Router from "next/router";

const Private = ({ children }) => {
  // jugaad hai isAuth aur useEffect sufficent tha waise, lekin ye pro hai
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    if (!isAuth()) {
      Router.push("/signin");
    }
    setIsAuthorized(isAuth() ? true : false);
  }, []);

  return isAuthorized ? <React.Fragment>{children}</React.Fragment> : null;
};

export default Private;
