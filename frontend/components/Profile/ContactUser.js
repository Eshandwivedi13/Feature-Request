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
import { getCookie } from "../../api/auth";

const Create = ({ buttonLabel }) => {
  const router = useRouter();
  const token = getCookie("token");
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setValues({ ...values, error: "", success: "", loading: "" });
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
    setValues({ ...values, loading: true });
    // setModal(!modal);
    e.preventDefault();
    const data = { title, description };
    makeFeature(data, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          loading: false,
          success: "Your Feature Has been sent Successfully",
        });
        setTimeout(() => {
          setModal(!modal);
          setValues({ ...values, error: "", success: "" });
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
            placeholder="Enter your title"
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
            placeholder="Enter your description "
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
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Request for New Feature</ModalHeader>
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
            Request Feature
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
