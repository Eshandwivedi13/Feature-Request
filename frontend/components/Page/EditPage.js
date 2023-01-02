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
  FormFeedback,
} from "reactstrap";
import { getCookie, isAuth } from "../../api/auth";
import { getSinglePage, makePage, updatePage } from "../../api/page";

const Update = ({ buttonLabel, className, slug }) => {
  const token = getCookie("token");
  // SOlution- pageTitle, pageDescription - jugaad
  const [values, setValues] = useState({
    title: "",
    description: "",
    error: false,
    loading: false,
    success: false,
    localErrors: {
      title: false,
      description: false,
    },
    pageTitle: "",
    pageDescription: "",
  });
  const {
    title,
    description,
    error,
    loading,
    success,
    localErrors,
    pageTitle,
    pageDescription,
  } = values;
  const getPage = async () => {
    await getSinglePage(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          title: data.title,
          pageTitle: data.title,
          description: data.description,
          pageDescription: data.description,
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
        title: pageTitle,
        // page:"",
        description: pageDescription,
        localErrors: { ...localErrors, title: "", description: "" },
      });
    }
  };

  const handleClick = (e) => {
    if (!isAuth()) {
      return router.push("/signin");
    }
    if (title === pageTitle && description === pageDescription) {
      return setModal(!modal);
    }
    setValues({ ...values, loading: true });
    // setModal(!modal);
    e.preventDefault();
    if (!title || title.length < 1) {
      return setValues({
        ...values,
        localErrors: { ...localErrors, title: "Title is Required" },
      });
    }
    if (title.length < 5 || title.length < 1) {
      return setValues({
        ...values,
        localErrors: { ...localErrors, title: "Title is Too short" },
      });
    }
    if (title.length > 100) {
      return setValues({
        ...values,
        localErrors: { ...localErrors, title: "Title is Too long" },
      });
    }
    if (!description || description.length < 1) {
      return setValues({
        ...values,
        localErrors: { ...localErrors, description: "Description is Required" },
      });
    }
    if (description.length < 25) {
      return setValues({
        ...values,
        localErrors: {
          ...localErrors,
          description: "Description is Too Short",
        },
      });
    }
    if (description.length > 750) {
      return setValues({
        ...values,
        localErrors: { ...localErrors, description: "Description is Too Big" },
      });
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
          localErrors: { ...localErrors, title: "", description: "" },
        });
        setTimeout(() => {
          setModal(!modal);
          setValues({
            ...values,
            error: "",
            success: "",
            // title: "",
            // description: "",
          });
        }, 2000);
      }
    });
  };

  const showLoading = () => {
    return loading ? <Alert color="primary">Loading...</Alert> : "";
  };
  const showError = () => {
    return error ? (
      <Alert color="danger" className="custom-alert-2">
        {error}
      </Alert>
    ) : (
      ""
    );
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
              setValues({
                ...values,
                title: e.target.value,
                error: "",
                localErrors: { ...localErrors, title: "" },
              });
            }}
            name="title"
            id="exampleTitle"
            placeholder="Enter Page Title"
            invalid={localErrors.title}
          />
          {localErrors.title && (
            <FormFeedback>{localErrors.title}</FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="exampleDescription" className="my-auto text-muted">
            Description
          </Label>
          <Input
            type="textarea"
            onChange={(e) => {
              setValues({
                ...values,
                description: e.target.value,
                error: "",
                localErrors: { ...localErrors, description: "" },
              });
            }}
            rows={7}
            value={description}
            name="description"
            id="exampleDescription"
            placeholder="Enter Page Description "
            invalid={localErrors.description}
          />
          {localErrors.description && (
            <FormFeedback>{localErrors.description}</FormFeedback>
          )}
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
