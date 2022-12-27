import React, { useState, useEffect } from "react";
import { FaYoutube } from "react-icons/fa";
import { isAuth } from "../../api/auth";

const Header = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  const authorizedContent = () => (
    <React.Fragment>
      <h1 className="d-flex align-items-center mb-3">
        <FaYoutube color="red" />{" "}
        <span className="ml-2">{isAuth().username}</span>
      </h1>

      <p>
        {/* isAUth ka about me */}
        Let us know how we can improve our app. Vote on existing ideas or
        suggest new ones.
      </p>
    </React.Fragment>
  );

  const unauthorizedContent = () => (
    <React.Fragment>
      <h1 className="d-flex align-items-center mb-3">
        <span className="">Feature Request</span>
      </h1>

      <p>Your Suggestion Matters</p>
    </React.Fragment>
  );

  return (
    <header
      className="p-5"
      style={{
        backgroundImage: "linear-gradient(to right,#fee5bc, #fdcb7b)",
      }}
    >
      {isAuth() ? authorizedContent() : unauthorizedContent()}
    </header>
  );
};

export default Header;
