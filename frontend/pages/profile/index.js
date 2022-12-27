import React from "react";
import PageLayout from "../../components/Layout";
import Private from "../../components/auth/Private";

const index = () => {
  return (
    <PageLayout>
      <Private>
        <div>this is user's page</div>
      </Private>
    </PageLayout>
  );
};

export default index;
