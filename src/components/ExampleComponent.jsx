import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { showToast } from "../helper-methods/index";
import { showLoader } from "../redux/actions/loaderData";

const ExampleComponent = () => {
  const dispatch = useDispatch();

  const _showLoader = () => {
    dispatch(showLoader());
  };

  return (
    <div>
      <div>Example Component</div>

      <Button
        color="primary"
        className="m-2"
        onClick={() => showToast("success message", "success")}
      >
        Show success toast
      </Button>

      <Button
        color="primary"
        className="m-2"
        onClick={() => showToast("error message", "error")}
      >
        Show error toast
      </Button>

      <Button color="primary" className="m-2" onClick={() => _showLoader()}>
        Show loader
      </Button>
    </div>
  );
};

export default ExampleComponent;
