import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Label,
  InputGroup,
  InputGroupText,
  FormGroup,
} from "reactstrap";
import PublicFooter from "../../containers/Public/PublicFooter";
import { addUserCredential } from "../../redux/actions/userCredential";
import SvgIcons from "../../components/SvgIcons";
import { APP_LOGO } from "../../config";
import {
  decodeToken,
  errorHandler,
  extractQueryParams,
} from "../../helper-methods";
import { login } from "../../http/http-calls";
import { RegexConfig } from "../../config/RegexConfig";
import getStorage from "redux-persist/es/storage/getStorage";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const [showPassword, setShowPassword] = useState(false);

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
            case "password": {
              if (newFormFields[key]?.length) {
                delete newErrors[key];
                newIsDirty[key] = false;
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

  // eslint-disable-next-line no-unused-vars
  const _completedAuthorization = (res = {}) => {
    try {
      let userData;
      if (!res.user) {
        userData = decodeToken(res.token);
        res.user = userData;
      }

      dispatch(addUserCredential({ token: res.token, user: res.user }));

      const { redirectTo } = extractQueryParams();

      navigate(redirectTo || "/x");
    } catch (error) {
      errorHandler(error);
    }
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

      const res = await login(payload);
      console.log(res.user);

      _completedAuthorization(res);
      const { token, user } = res;

      dispatch(addUserCredential({ token: token, user: { user } }));

      navigate("/dashboard");
    } catch (error) {
      errorHandler(error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="authWrapper">
        <div className="loginWrap">
          <img src={APP_LOGO} alt="Brand Logo" className="companyLogo" />

          <Form onSubmit={(e) => _onSubmit(e)}>
            <h2>Login</h2>

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

            <FormGroup>
              <Label>Password</Label>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="off"
                  name="password"
                  value={formFields.password}
                  onChange={(e) =>
                    _onChangeFormFields("password", e.target.value)
                  }
                  onBlur={() => _onBlurFormFields("password")}
                />
                <InputGroupText
                  className="cursorPointer"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  <SvgIcons type={`${showPassword ? "eye" : "closeEye"}`} />
                </InputGroupText>
              </InputGroup>
              {errors["password"] ? (
                <div className="form-error">{errors["password"]}</div>
              ) : null}
            </FormGroup>

            <div className="text-end">
              <Link
                to={
                  `/forgot-password` +
                  (formFields.handle?.trim()
                    ? `?handle=${formFields.handle}`
                    : ``)
                }
                className="forgotPassword"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? <i className="fa fa-spinner fa-spin" /> : null} Login
            </Button>
          </Form>
        </div>

        <PublicFooter />
      </div>
    </>
  );
};

export default LoginPage;
