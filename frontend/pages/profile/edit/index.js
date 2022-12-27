import React from "react";
import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import EditProfile from "../../../components/Profile/EditProfile";

const index = () => {
  return (
    <React.Fragment>
      <Layout>
        <Private>
          <EditProfile />
        </Private>
      </Layout>
    </React.Fragment>
  );
};

export default index;
