import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import PublicFooter from "../../containers/Public/PublicFooter";
import { APP_LOGO } from "../../config";
import {
  errorHandler,
  extractQueryParams,
  showToast,
} from "../../helper-methods";
import { RegexConfig } from "../../config/RegexConfig";
import { forgotPassword } from "../../http/http-calls";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    handle: "",
    password: "",
  });
  const [isDirty, setIsDirty] = useState({
    handle: false,
    password: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const _validateFormFields = ({ newFormFields, newIsDirty }) => {
    return new Promise((resolve) => {
      const newErrors = { ...errors };
      let isFormValid = true;

      Object.keys(newFormFields).forEach((key) => {
        if (newIsDirty[key]) {
          switch (key) {
            case "handle": {
              if (newFormFields[key]?.trim().length) {
                if (
                  RegexConfig.email.test(
                    String(newFormFields[key]).toLowerCase()
                  )
                ) {
                  delete newErrors[key];
                  newIsDirty[key] = false;
                } else {
                  newErrors[key] = "*Invalid email";
                  isFormValid = false;
                }
              } else {
                newErrors[key] = "*Required";
                isFormValid = false;
              }
              break;
            }
            default:
          }
        }
      });

      setErrors(newErrors);
      setIsDirty(newIsDirty);

      resolve(isFormValid);
    });
  };

  const _onChangeFormFields = (key, value) => {
    const newFormFields = { ...formFields };
    newFormFields[key] = value;
    setFormFields(newFormFields);

    const newErrors = { ...errors };
    if (newErrors[key]) {
      newErrors[key] = false;
      setErrors(newErrors);
    }
  };

  const _onBlurFormFields = (key) => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };
    newIsDirty[key] = true;

    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _onSubmit = async (e) => {
    try {
      if (e) e.preventDefault();

      const newFormFields = { ...formFields };
      const newIsDirty = { ...isDirty };
      Object.keys(newFormFields).forEach((key) => {
        newIsDirty[key] = true;
      });

      const isFormValid = await _validateFormFields({
        newFormFields,
        newIsDirty,
      });

      if (!isFormValid) {
        return;
      }

      setLoading(true);

      const payload = {
        ...formFields,
      };

      await forgotPassword(payload);

      showToast("We have emailed the reset password instructions.", "success");
      navigate("/login");
    } catch (error) {
      errorHandler(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const { handle } = extractQueryParams();
    if (typeof handle === "string" && handle?.trim()) {
      _onChangeFormFields("handle", handle?.trim());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="authWrapper">
        <div className="loginWrap">
          <img src={APP_LOGO} alt="Brand Logo" className="companyLogo" />

          <Form onSubmit={(e) => _onSubmit(e)}>
            <h2>Forgot Password</h2>

            <FormGroup>
              <Label>Email</Label>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  autoComplete="off"
                  name="handle"
                  value={formFields.handle}
                  onChange={(e) =>
                    _onChangeFormFields("handle", e.target.value)
                  }
                  onBlur={() => _onBlurFormFields("handle")}
                />
                <InputGroupText>
                  <i className="far fa-envelope" />
                </InputGroupText>
              </InputGroup>
              {errors["handle"] ? (
                <div className="form-error">{errors["handle"]}</div>
              ) : null}
            </FormGroup>

            <Button
              type="submit"
              color="primary"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? <i className="fa fa-spinner fa-spin" /> : null} Forgot
              Password
            </Button>

            <div className="text-center fs-16 mt-3">
              Back to{" "}
              <Link to="/login" style={{ textDecoration: "underline" }}>
                Login
              </Link>
            </div>
          </Form>
        </div>

        <PublicFooter />
      </div>
    </>
  );
};

export default ForgotPasswordPage;
