import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { getCookie, isAuth } from "../../api/auth";
import { getSinglePage, makePage, updatePage } from "../../api/page";

const Update = ({ buttonLabel, className, slug }) => {
  const token = getCookie("token");

  const getPage = () => {
    getSinglePage(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          title: data.title,
          description: data.description,
        });
      }
    });
  };
  useEffect(() => {
    console.log("slug", slug);
    getPage();
  }, []);

  const router = useRouter();
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setValues({
        ...values,
        error: "",
        success: "",
        loading: "",
        title: "",
        // page:"",
        description: "",
      });
    }
  };
  const [values, setValues] = useState({
    title: "",
    description: "",
    error: false,
    loading: false,
    success: false,
  });
  const { title, description, error, loading, success } = values;
  const handleClick = (e) => {
    if (!isAuth()) {
      return router.push("/signin");
    }
    setValues({ ...values, loading: true });
    // setModal(!modal);
    e.preventDefault();
    if (!title) {
      return setValues({ ...values, error: "Title is Required" });
    }
    if (!description) {
      return setValues({ ...values, error: "Title is Required" });
    }
    const data = { title, description };
    updatePage(slug, token, data).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          loading: false,
          success: "Your Page Has been Updated Successfully",
        });
        setTimeout(() => {
          setModal(!modal);
          setValues({
            ...values,
            error: "",
            success: "",
            title: "",
            description: "",
          });
        }, 2000);
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
  const createForm = () => {
    return (
      <Form>
        <FormGroup>
          <Label for="exampleTitle" className="my-auto text-muted">
            Title
          </Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => {
              setValues({ ...values, title: e.target.value, error: "" });
            }}
            name="title"
            id="exampleTitle"
            placeholder="Enter Page Title"
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleDescription" className="my-auto text-muted">
            Description
          </Label>
          <Input
            type="textarea"
            onChange={(e) => {
              setValues({ ...values, description: e.target.value, error: "" });
            }}
            rows={7}
            value={description}
            name="description"
            id="exampleDescription"
            placeholder="Enter Page Description "
          />
        </FormGroup>
      </Form>
    );
  };
  return (
    <div className="">
      <Button color="primary" size="sm" onClick={toggle}>
        {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className} centered>
        <ModalHeader toggle={toggle}>Edit Your Page</ModalHeader>
        <ModalBody>
          <div className="">
            {showSuccess()}
            {showError()}
            {showLoading()}
          </div>
          {createForm()}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleClick}>
            Edit Page
          </Button>

          <Button color="primary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Update;
