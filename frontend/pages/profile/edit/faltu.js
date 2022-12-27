import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Row,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  FormGroup,
  Input,
  Form,
  Label,
  FormFeedback,
  FormText,
} from "reactstrap";
import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import DefaultProfile from "../../../public/images/profile.jpg";

const editUserProfile = ({ data }) => {
  const user = data.user;

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    username: "",
    bio: "",
  });
  const { fullName, email, username, bio } = values;
  const [hydrated, setHydrated] = useState(false);
  // useEffect(() => {
  //   setHydrated(true);
  // }, []);
  // if (!hydrated) {
  //   return null;
  // }
  const handleSubmit = () => {};

  const editProfileContent = () => {
    return (
      <Container className="mt-5">
        {/* <div className="d-flex">
          <div className="p-4">
            <img
              // style={{ height: " 60%", borderRadius: "6px", width: "auto" }}
              style={{ height: " 150px", borderRadius: "7px", width: "150px" }}
              src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA14dHoX.img?w=612&h=408&m=6&x=297&y=139&s=355&d=355"
              alt={data.username}
              onError={(i) => (i.target.src = `${DefaultProfile}`)}
              // const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile
            />
          </div>
          <div className="p-4 w-100">
            <h2 className="mb-3"> @{user.username}</h2>
          </div>
        </div> */}
        <Row>
          <div className="col-lg-4">
            <h4>General</h4>
            <p>update your profile</p>
          </div>

          <div className="col-lg-8 ">
            <Card
              className="mb-5"
              style={{
                maxWidth: "400px",
                boxShadow: " 0 0 10px #0000001f",
                border: "none",
                borderRadius: "10px",
                // position: "relative",
              }}
            >
              <CardBody>
                <div className=" d-flex justify-content-center">
                  <div
                    style={{ borderRadius: "8px", border: "6px solid #f6f6f6" }}
                    // className="m-3"
                  >
                    <img
                      style={{
                        height: " 192px",
                        width: "192px",
                      }}
                      src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA14dHoX.img?w=612&h=408&m=6&x=297&y=139&s=355&d=355"
                      alt={user.username}
                      onError={(i) => (i.target.src = `${DefaultProfile}`)}
                    />
                  </div>
                </div>
                <hr />

                <Form>
                  <FormGroup>
                    <Label className="d-flex justify-content-between">
                      <span>Email</span>
                      <span>(Can't be edited)</span>
                    </Label>
                    <Input
                      type="text"
                      // placeholder="Enter your Email"
                      disabled
                      value={user.email}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Full Name</Label>
                    <Input
                      type="text"
                      value={user.fullName}
                      onChange={(e) => {
                        setValues({
                          ...values,
                          fullName: e.target.value,
                          error: "",
                        });
                      }}
                      // name="title"
                      // id="exampleTitle"
                      placeholder="Please Enter Full Name"
                    />
                    {/* <Input valid /> */}
                    {/* <FormFeedback valid invalid> 
                      Sweet! that name is available
                    </FormFeedback> */}
                  </FormGroup>

                  <FormGroup>
                    <Label for="exampleEmail">Username</Label>
                    <Input
                      value={user.username}
                      type="text"
                      placeholder="Enter your Username"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleEmail">Bio</Label>
                    <Input
                      type="textarea"
                      rows={5}
                      placeholder="I am a gamer ...."
                    />
                  </FormGroup>
                </Form>
                <Button color="primary">Submit</Button>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>

      // <div>{JSON.stringify(data)}</div>
    );
  };
  return (
    <React.Fragment>
      <Layout>
        <Private>{editProfileContent()}</Private>{" "}
      </Layout>
    </React.Fragment>
  );
};

export default editUserProfile;

export async function getServerSideProps(context) {
  const { username } = context.query;
  // console.log(slug);
  if (!username) {
    return {
      props: { data: null },
    };
  }
  let result = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/user/${username}`);
    result = await res.json();
  } catch (error) {
    return {
      props: { data: null },
    };
  }
  return {
    props: { data: result },
  };
}
