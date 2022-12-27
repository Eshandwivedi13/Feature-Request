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

import DefaultProfile from "../../public/images/profile.jpg";
import { isAuth, updateAuth } from "../../api/auth";
import { updateUserAvatar, updateUserData } from "../../api/user";
import { getCookie } from "../../api/auth";
// const handleClick = (e) => {
//   setValues({ ...values, loading: true });
//   // setModal(!modal);
//   e.preventDefault();
//   const data = { title, description };
//   updateFeature(slug, token, data).then((data) => {
//     if (data.error) {
//       setValues({ ...values, error: data.error, loading: false });
//     } else {
//       setValues({
//         ...values,
//         loading: false,
//         success: "Your Feature Has been Updated Successfully",
//       });
//       setTimeout(() => {
//         setModal(!modal);
//         setValues({ ...values, error: "", success: "" });
//       }, 2000);
//     }
//   });
// };
const token = getCookie("token");

const editUserProfile = () => {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    username: "",
    bio: "",
    loading: false,
    error: false,
    success: false,
    // userData: process.browser && new FormData(),
  });
  const { fullName, email, username, bio, loading, error, success } = values;

  const user = isAuth();
  useEffect(() => {
    setValues({
      ...values,
      fullName: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
    });
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    //method
    const id = isAuth()._id;
    let data = { name: fullName, bio, username };
    // if (!data.bio) {
    //   setValues({ ...values, bio: "" });
    //   data = { name: fullName, bio, username };
    //   console.log("chala kya");
    // }
    updateUserData(data, id, token).then((data) => {
      if (data.error) {
        console.log("error", data.error);
        setValues({
          ...values,
          error: data.error,
          success: false,
          loading: false,
        });
      } else {
        updateAuth(data, () => {
          // Router.push("/admin");
          setValues({
            ...values,
            username: data.username,
            name: data.name,
            bio: data.bio,
            success: true,
            loading: false,
          });
          setTimeout(() => {
            setValues({ ...values, success: false });
          }, 3000);
        });
      }
    });
  };
  // const handleFile = (e) => {
  //   if (!e.target.files[0]) {
  //     console.log("No file select");
  //     return;
  //   }
  //   setValues({ ...values, loading: true });
  //   let userFormData = new FormData();
  //   userFormData.set("avatar", e.target.files[0]);
  //   updateUserAvatar(userFormData, token).then((err, data) => {
  //     if (data.error) {
  //       setValues({
  //         ...values,
  //         error: data.error,
  //         success: false,
  //         loading: false,
  //       });
  //     } else {
  //       setValues({ ...values, error: false, success: true, loading: false });
  //     }
  //   });
  // };
  const editProfileContent = () => {
    return (
      <Container className="mt-5">
        <Row>
          <div className="col-lg-4">
            <h4>General</h4>
            <p>Update your profile</p>
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
                        objectFit: "cover",
                      }}
                      src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA14dHoX.img?w=612&h=408&m=6&x=297&y=139&s=355&d=355"
                      alt={username}
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
                      value={email}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Full Name</Label>
                    <Input
                      type="text"
                      value={fullName}
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
                      value={username}
                      onChange={(e) => {
                        setValues({
                          ...values,
                          username: e.target.value,
                          error: "",
                        });
                      }}
                      type="text"
                      placeholder="Enter your Username"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="bio">Bio</Label>
                    <textarea
                      //   type="textarea"
                      className="w-100"
                      value={bio}
                      onChange={(e) => {
                        setValues({
                          ...values,
                          bio: e.target.value,
                          error: "",
                        });
                      }}
                      rows="5"
                      placeholder="I am a gamer ...."
                    ></textarea>
                  </FormGroup>

                  {/* <FormGroup>
                    <input
                      // onChange={handleFile}
                      type="file"
                      id="imageUpload"
                      accept=".png, .jpg, .jpeg"
                    />
                    <label htmlFor="imageUpload">
                      <FiEdit className="m-2" color="#7d7d7d" size={20} />
                      photo
                    </label>
                  </FormGroup> */}

                  {/* ab */}
                </Form>
                <Button onClick={handleClick} color="primary">
                  Submit
                </Button>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>

      // <div>{JSON.stringify(data)}</div>
    );
  };
  return <React.Fragment>{editProfileContent()}</React.Fragment>;
};

export default editUserProfile;
