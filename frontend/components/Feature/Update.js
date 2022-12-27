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
import {
  makeFeature,
  getSingleFeature,
  updateFeature,
} from "../../api/feature";
import { getCookie } from "../../api/auth";

const Update = ({ buttonLabel, className }) => {
  const token = getCookie("token");
  const router = useRouter();
  const [values, setValues] = useState({
    title: "",
    description: "",
    error: false,
    loading: false,
    success: false,
  });
  const { title, description, error, loading, success } = values;
  const loadFeature = (slug) => {
    getSingleFeature(slug).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          //  loading: false
        });
      } else {
        setValues({
          ...values,
          title: data.title,
          description: data.description,
          // loading: false,
        });
      }
    });
  };
  const slug = router.query.slug;

  useEffect(() => {
    // console.log("chala kya?", slug);

    loadFeature(slug);
  }, [router]);

  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (modal) {
      setValues({ ...values, error: "", success: "", loading: "" });
    }
    setModal(!modal);
  };

  const handleClick = (e) => {
    setValues({ ...values, loading: true });
    // setModal(!modal);
    e.preventDefault();
    const data = { title, description };
    updateFeature(slug, token, data).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          loading: false,
          success: "Your Feature Has been Updated Successfully",
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
  const updateForm = () => {
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
    <React.Fragment>
      <Button color="primary" size="sm" onClick={toggle} className={className}>
        {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Update Your Feature</ModalHeader>
        <ModalBody>
          <div className="">
            {showSuccess()}
            {showError()}
            {showLoading()}
          </div>
          {updateForm()}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleClick}>
            Update Feature
          </Button>

          <Button color="primary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default Update;
