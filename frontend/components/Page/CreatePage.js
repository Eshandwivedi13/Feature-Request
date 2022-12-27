import React, { useState } from "react";
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
import { makeFeature } from "../../api/feature";
import { getCookie, isAuth } from "../../api/auth";
import { makePage } from "../../api/page";

const Create = ({ buttonLabel, className }) => {
  const router = useRouter();
  const token = getCookie("token");
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
    if (!title && !title.length) {
      return setValues({
        ...values,
        error: "Title  is required",
      });
    }
    if (title.length > 100) {
      return setValues({
        ...values,
        error: "Title is Too Big",
      });
    }
    if (title.length < 5) {
      return setValues({
        ...values,
        error: "Title is Too Short",
      });
    }
    if (!description && !description.length) {
      return setValues({
        ...values,
        error: "Description  is required",
      });
    }
    if (description.length < 25) {
      return setValues({
        ...values,
        error: "Description is Too Short",
      });
    }
    if (description.length > 750) {
      return setValues({
        ...values,
        error: "Description is Too Large",
      });
    }
    setValues({ ...values, loading: true });
    // setModal(!modal);
    e.preventDefault();
    const data = { title, description };
    makePage(data, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          loading: false,
          success: "Your Page Has been Created Successfully",
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
        <ModalHeader toggle={toggle}>Create a New Page</ModalHeader>
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
            Create Page
          </Button>

          <Button color="primary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Create;
