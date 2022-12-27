import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Alert,
} from "reactstrap";
import { signup } from "../../api/auth";
import Router from "next/router";
const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: false,
    loading: false,
    success: false,
    username: "",
    localErrors: {
      email: "",
      username: "",
      password: "",
    },
  });
  const { email, password, error, loading, success, username, localErrors } =
    values;
  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    const user = { username, email, password };
    signup(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          loading: false,
          success: data.message,

          email: "",
          username: "",
          password: "",
        });
        setTimeout(() => {
          setValues({
            ...values,
            success: false,
          });
          Router.push("/");
        }, 1000);
      }
    });
  };
  const showLoading = () => {
    return loading ? <Alert color="primary">Loading...</Alert> : "";
  };
  const showError = () => {
    return error ? <Alert color="danger">{error}</Alert> : "";
  };
  const showSuccess = () => {
    return success ? <Alert color="success">{success}</Alert> : "";
  };

  const signupForm = (email, password, username) => (
    <Form className="" onSubmit={handleSubmit}>
      <FormGroup>
        <Input
          className="input-big"
          type="username"
          value={username}
          onChange={(e) => {
            setValues({ ...values, username: e.target.value, error: "" });
          }}
          name="username"
          id="exampleName"
          placeholder="Username"
        />
      </FormGroup>
      <FormGroup>
        <Input
          className="input-big"
          type="email"
          value={email}
          onChange={(e) => {
            setValues({ ...values, email: e.target.value, error: "" });
          }}
          name="email"
          id="exampleEmail"
          placeholder="Email"
        />
      </FormGroup>
      <FormGroup>
        <Input
          className="input-big"
          type="password"
          onChange={(e) => {
            setValues({ ...values, password: e.target.value, error: "" });
          }}
          value={password}
          name="password"
          id="examplePassword"
          placeholder="Password"
        />
      </FormGroup>
      <Button color="primary" className="w-100 button-height">
        Submit
      </Button>
    </Form>
  );
  return (
    <React.Fragment>
      <div className="px-5 text-center mt-5">
        <h1 className="">Signup To Feature Request</h1>
        <h3 className="mt-3 text-muted">
          Welcome back to the Wallpaper Social Network <br /> Share something
          awesome with us
        </h3>
      </div>
      <div className="m-5 d-flex justify-content-center">
        <div className="col-10 col-lg-5">
          {showError()}
          {showLoading()}
          {showSuccess()}
          {signupForm(email, password, username)}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Signin;
