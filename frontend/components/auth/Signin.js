import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Alert,
  Container,
  Spinner,
  FormFeedback,
} from "reactstrap";
import { authenticate, signin } from "../../api/auth";
import Router from "next/router";
const Signin = () => {
  const [values, setValues] = useState({
    emailorusername: "",
    password: "",
    error: false,
    loading: false,
    success: false,
    localErrors: {
      emailOrUsername: "",
      password: "",
    },
  });
  const { emailorusername, password, error, loading, success, localErrors } =
    values;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailorusername && !emailorusername.length) {
      return setValues({
        ...values,
        localErrors: {
          ...localErrors,
          emailOrUsername: "Email or Username is Required",
        },
      });
    }
    if (!password && !password.length) {
      return setValues({
        ...values,
        localErrors: {
          ...localErrors,
          password: "Password is Required",
        },
      });
    }

    // if (!password && !password.length) {
    //   return setValues({
    //     ...values,
    //     localErrors: {
    //       ...localErrors,
    //       password: "Password is Required",
    //     },
    //   });
    // }
    setValues({ ...values, loading: true });
    const user = { emailorusername, password };
    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          Router.push("/");
          // if (isAuth() && isAuth().role === 1) {
          //   Router.push(`/admin`);
          // } else {
          //   Router.push(`/user`);
          // }
        });
      }
    });
  };
  const showLoading = () => {
    return loading ? <Spinner color="primary" /> : "";
  };
  const showError = () => {
    return error ? (
      <Alert color="danger" className="custom-alert">
        {error}
      </Alert>
    ) : (
      ""
    );
  };
  const showSuccess = () => {
    return success ? <Alert color="success">{success}</Alert> : "";
  };

  const signinForm = (emailorusername, password) => (
    <Form className="" onSubmit={handleSubmit}>
      <FormGroup>
        <Input
          type="text"
          value={emailorusername}
          onChange={(e) => {
            setValues({
              ...values,
              emailorusername: e.target.value,
              error: "",
              localErrors: {
                emailOrUsername: "",
                password: "",
              },
            });
          }}
          name="email"
          id="exampleEmail"
          placeholder="Email or Username"
          className="input-big"
          invalid={localErrors.emailOrUsername}
        />
        {localErrors.emailOrUsername && (
          <FormFeedback>{localErrors.emailOrUsername}</FormFeedback>
        )}
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          onChange={(e) => {
            setValues({ ...values, password: e.target.value, error: "" });
          }}
          value={password}
          name="password"
          id="examplePassword"
          placeholder="Password "
          className="input-big"
          invalid={localErrors.password}
        />
        {localErrors.password && (
          <FormFeedback>{localErrors.password}</FormFeedback>
        )}
      </FormGroup>

      <FormGroup>
        <Button color="primary" className="w-100 button-height">
          Submit
        </Button>
      </FormGroup>
    </Form>
  );

  // return (
  //   <React.Fragment>
  //     <div className="container d-flex justify-content-center flex-column my-3">
  //       <div className="m-5 ">
  //         <h1 className="text-center">Login On Feature Request</h1>
  //         <h3 className="mt-3 text-muted text-center">
  //           Welcome back to the Wallpaper Social Network <br /> Share something
  //           awesome with us
  //         </h3>
  //       </div>
  //       <div className="">
  //         <div className="col-12 col-lg-5">
  //           {showError()}
  //           {showLoading()}
  //           {showSuccess()}
  //           {signinForm(emailorusername, password)}
  //         </div>
  //       </div>
  //     </div>
  //   </React.Fragment>
  // );

  // bina container
  // return (
  //   <React.Fragment>
  //     <div className="my-5">
  //       <h1 className="text-center">Login On Feature Request</h1>
  //       <h3 className="mt-3 text-muted text-center">
  //         Welcome back to the Wallpaper Social Network <br /> Share something
  //         awesome with us
  //       </h3>
  //     </div>
  //     <div className="d-flex justify-content-center">
  //       <div className="col-10 col-lg-5 mt-5">
  //         {showError()}
  //         {showLoading()}
  //         {showSuccess()}
  //         {signinForm(emailorusername, password)}
  //       </div>
  //     </div>
  //   </React.Fragment>
  // );

  return (
    <React.Fragment>
      <div className="px-5 text-center mt-5">
        <h1 className="">Login To Feature Request</h1>
        <h3 className="mt-3 text-muted">
          Welcome back to the Wallpaper Social Network <br /> Share something
          awesome with us
        </h3>
      </div>

      <div className=" row justify-content-center mt-5 ">
        <div className="col-10 col-lg-5 col-xl-5">
          {showError()}
          {showLoading()}
          {showSuccess()}
          {signinForm(emailorusername, password)}
        </div>
        <div className="col-10 col-lg-5">
          <Button className="w-100 button-height" color="primary">
            Login With Google
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Signin;

// <FormGroup className="d-inline-flex">
// <Label className="">Avatar</Label>
// <Label className="btn btn-outline-info " for="exampleFile" sm={8}>
//   Upload your image
//   <Input type="file" name="file" id="exampleFile" hidden />
// </Label>
// </FormGroup>
