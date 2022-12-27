import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Alert,
  InputGroupAddon,
  InputGroupText,
  FormFeedback,
  InputGroup,
  Spinner,
} from "reactstrap";
import { authenticate, signup } from "../../api/auth";
import Router from "next/router";
import {
  FaRegCircle,
  FaRegCheckCircle,
  FaRegTimesCircle,
} from "react-icons/fa";
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
  // const validateEmail = (mail) => {
  //   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
  //     return true;
  //   }
  //   alert("You are writing invalid email address!");
  //   return false;
  // };
  const { email, password, error, loading, success, username, localErrors } =
    values;
  const handleSubmit = (e) => {
    e.preventDefault();
    // validate user
    if (!email) {
      setValues({
        ...values,
        localErrors: { ...localErrors, email: "Email is Required" },
      });
    }
    // else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    //   console.log("??? batao na");
    //   setValues({
    //     ...values,
    //     localErrors: {
    //       ...localErrors,
    //       password: "Must be a Valid Email",
    //     },
    //   });
    // }
    else if (!username) {
      setValues({
        ...values,
        localErrors: { ...localErrors, username: "Username is Required" },
      });
    } else if (username.length < 2 || username.length > 20) {
      return setValues({
        ...values,
        localErrors: {
          ...localErrors,
          username: "Please Choose a username between 2 to 20 characters",
        },
        loading: false,
      });
    } else if (!password) {
      setValues({
        ...values,
        localErrors: { ...localErrors, password: "Password is Required" },
      });
    } else if (password.length < 6) {
      setValues({
        ...values,
        localErrors: {
          ...localErrors,
          password: "Password Must be 6 Characters Long",
        },
      });
    } else {
      setValues({ ...values, loading: true });
      const user = { username, email, password };
      signup(user).then((data) => {
        if (data.error) {
          console.log(data.error);
          //error handling
          if (data.error.includes("Username")) {
            return setValues({
              ...values,
              localErrors: {
                ...localErrors,
                username: "Username Already Exists",
              },
              loading: false,
            });
          }
          if (data.error === "email is taken") {
            return setValues({
              ...values,
              localErrors: {
                ...localErrors,
                email: "Email is Taken",
              },
              loading: false,
            });
          }

          if (data.error.includes(" email")) {
            return setValues({
              ...values,
              localErrors: {
                ...localErrors,
                email: "Must be a valid Email",
              },
              loading: false,
            });
          }
          if (data.error.includes("Password")) {
            return setValues({
              ...values,
              loading: false,
              localErrors: {
                ...localErrors,
                password: "Password Must contain a number ",
              },
            });
          }
          // if (data.errorField) {
          //   setValues({
          //     ...values,
          //     localErrors: { ...localErrors, [data.errorField]: data.error },loading: false
          //   });
          // }else{
          //   setValues({
          //     ...values,
          //     error: data.error,
          //     loading: false,
          //   });
          // }
          // setValues({ ...values, error: data.error, loading: false });
        } else {
          //
          setValues({
            ...values,
            success: data.message,
            email: "",
            username: "",
            password: "",
            loading: false,
            localErrors: {
              email: "",
              username: "",
              password: "",
            },
          });
          authenticate(data, () => {
            Router.push("/");
          });
          // we have to authenticate user, uske liye backend se token bhi bhejo
          // setTimeout(() => {
          //   console.log("data ? ", data);

          //   setValues({
          //     ...values,
          //     success: false,
          //     loading: false,
          //   });
          //   Router.push("/");
          // }, 1000);
        }
      });
    }
  };
  const showLoading = () => {
    return loading ? <Spinner color="primary" /> : "";
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
          type="email"
          value={email}
          onChange={(e) => {
            setValues({
              ...values,
              email: e.target.value,
              // error: "",
              localErrors: {
                email: "",
                username: "",
                password: "",
              },
            });
          }}
          invalid={localErrors.email}
          name="email"
          id="exampleEmail"
          placeholder="Email"
        />
        {localErrors.email && <FormFeedback> {localErrors.email}</FormFeedback>}{" "}
      </FormGroup>

      <FormGroup className="d-flex">
        <InputGroup>
          <Input
            className="input-big"
            // type="username"
            type="text"
            value={username}
            onChange={(e) => {
              setValues({
                ...values,
                username: e.target.value,
                // error: "",
                localErrors: {
                  email: "",
                  username: "",
                  password: "",
                },
              });
            }}
            invalid={localErrors.username}
            name="username"
            id="exampleName"
            placeholder="Username"
          />
          <InputGroupAddon addonType="append">
            <InputGroupText
              style={{ border: "2px #f0f2f5 ", backgroundColor: "#f0f2f5" }}
            >
              <i
              // className="mr-3 d-flex"
              >
                {username ? (
                  localErrors.username ? (
                    <FaRegTimesCircle size={24} color="#e34b4b" />
                  ) : (
                    <FaRegCheckCircle size={24} color="#5fe34b" />
                  )
                ) : (
                  <FaRegCircle size={24} />
                )}
              </i>
            </InputGroupText>
          </InputGroupAddon>
          <FormFeedback> {localErrors.username}</FormFeedback>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Input
          className="input-big"
          type="password"
          onChange={(e) => {
            setValues({
              ...values,
              password: e.target.value,
              // error: "",
              localErrors: {
                email: "",
                username: "",
                password: "",
              },
            });
          }}
          value={password}
          name="password"
          id="examplePassword"
          placeholder="Password"
          invalid={localErrors.password}
        />
        {localErrors.password && (
          <FormFeedback>{localErrors.password}</FormFeedback>
        )}
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
