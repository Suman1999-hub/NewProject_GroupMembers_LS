import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import SvgIcons from "../SvgIcons";
import { RegexConfig } from "../../config/RegexConfig";
import {
  capitalize,
  deepClone,
  errorHandler,
  getFullName,
  openUrlOnNewTab,
  showToast,
  splitFullName,
  uploadFileOnServer,
} from "../../helper-methods";

const initialFormFields = {
  name: "",
  email: "",
  phone: "",
  countryCode: "+1",
  referCode: "",

  addressStreet: "",
  addressCity: "",
  addressState: "", // state
  addressZip: "",
  addressCountry: "US",
};

const initialVslData = {
  uploadData: null,
  previewBlob: null,
  type: "video",
  url: null,
};

const NewGroupModal = ({ isOpen, data, toggle, onSuccess = () => {} }) => {
  const [formFields, setFormFields] = useState(deepClone(initialFormFields));
  const [isDirty, setIsDirty] = useState({});
  const [vslData, setVslData] = useState(deepClone(initialVslData));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const _setModalState = (data = null) => {
    setFormFields({
      name: data?.name ? getFullName(data?.name) : "",
      email: data?.email || "",
      phone: data?.phone || "",
      countryCode: "+1",
      referCode: data?.referCode || "",

      addressStreet: data?.address?.Line1 || "",
      addressCity: data?.address?.City || "",
      addressState: data?.address?.CountrySubDivisionCode || "", // state
      addressZip: data?.address?.PostalCode || "",
      addressCountry: data?.address?.Country || "US",
    });
    setIsDirty({});
    setVslData({
      uploadData: null,
      previewBlob: null,
      type: "video",
      url: data?.vsl || null,
    });
    setErrors({});
    setLoading(false);
  };

  const _closeModal = () => {
    _setModalState();
    toggle();
  };

  const _validateFormFields = ({ newFormFields, newIsDirty }) => {
    return new Promise((resolve) => {
      const newErrors = { ...errors };
      let isFormValid = true;

      Object.keys(newFormFields).forEach((key) => {
        if (newIsDirty[key]) {
          switch (key) {
            case "email":
            case "phone": {
              if (newFormFields[key]?.trim().length) {
                if (
                  RegexConfig[key].test(
                    String(newFormFields[key]).toLowerCase()
                  )
                ) {
                  delete newErrors[key];
                  newIsDirty[key] = false;
                } else {
                  newErrors[key] = `*Invalid ${key}`;
                  isFormValid = false;
                }
              } else {
                newErrors[key] = "*Required";
                isFormValid = false;
              }
              break;
            }
            case "name": {
              if (newFormFields[key]?.length) {
                if (
                  newFormFields[key]?.length >= 2 &&
                  newFormFields[key]?.length <= 50
                ) {
                  if (
                    RegexConfig.nameWithoutSpecialCharactersAndNumber.test(
                      String(newFormFields[key]).toLowerCase()
                    )
                  ) {
                    delete newErrors[key];
                    newIsDirty[key] = false;
                  } else {
                    newErrors[key] = `*Invalid ${key}`;
                    isFormValid = false;
                  }
                } else {
                  newErrors[key] =
                    "*Please enter a value between 2 and 50 characters.";
                  isFormValid = false;
                }
              } else {
                newErrors[key] = "*Required";
                isFormValid = false;
              }
              break;
            }
            case "referCode": {
              if (newFormFields[key]?.length) {
                if (
                  RegexConfig.username.test(
                    String(newFormFields[key]).toLowerCase()
                  )
                ) {
                  delete newErrors[key];
                  newIsDirty[key] = false;
                } else {
                  newErrors[key] = `*Invalid code`;
                  isFormValid = false;
                }
              } else {
                newErrors[key] = "*Required";
                isFormValid = false;
              }
              break;
            }
            case "addressCity":
            case "addressState": {
              if (newFormFields[key]?.trim().length) {
                if (
                  newFormFields[key]?.trim().length > 1 &&
                  newFormFields[key]?.trim().length < 50 &&
                  RegexConfig.alphanumericMultiWord.test(
                    String(newFormFields[key]).toLowerCase()
                  )
                ) {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                } else {
                  newErrors[key] =
                    "*Minimum 2 characters & Maximum 50 characters. Number & special character not allowed except -.&,'/";
                  isFormValid = false;
                }
              } else {
                newErrors[key] = "*Required";
                isFormValid = false;
              }
              break;
            }
            case "addressStreet": {
              if (newFormFields[key]?.trim().length) {
                if (
                  newFormFields[key]?.trim().length > 1 &&
                  newFormFields[key]?.trim().length < 100 &&
                  RegexConfig.alphanumericMultiWord.test(
                    String(newFormFields[key]).toLowerCase()
                  )
                ) {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                } else {
                  newErrors[key] =
                    "*Minimum 2 characters & Maximum 100 characters & number. Special character not allowed except -.&,'/";
                  isFormValid = false;
                }
              } else {
                newErrors[key] = "*Required";
                isFormValid = false;
              }
              break;
            }
            case "addressZip": {
              if (newFormFields[key]?.trim().length) {
                if (
                  !isNaN(newFormFields[key]?.trim()) &&
                  newFormFields[key]?.trim().length === 5
                ) {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                } else {
                  newErrors[key] = "*Must be 5 number";
                  isFormValid = false;
                }
              } else {
                newErrors[key] = "*Required";
                isFormValid = false;
              }
              break;
            }
            case "addressCountry": {
              if (newFormFields[key]?.trim().length) {
                newErrors[key] = null;
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
    if (
      key === "phone" &&
      (isNaN(value) ||
        value.includes(".") ||
        +value < 0 ||
        String(value)?.length > 10)
    ) {
      return;
    }
    if (
      key === "addressZip" &&
      (isNaN(value) ||
        value.includes(".") ||
        +value < 0 ||
        String(value)?.length > 5)
    ) {
      return;
    }

    const newFormFields = { ...formFields };

    if (key === "addressCountry") {
      newFormFields.addressState = "";
    }

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

  const _resetVslData = () => {
    setVslData(deepClone(initialVslData));
  };

  const _onChangeFile = async (event) => {
    try {
      if (!event?.target?.files?.length) {
        return;
      }

      const file = event?.target?.files?.[0];
      const fileType = file.type.split("/")[0];

      if (fileType !== "video") {
        showToast("Only Video file is allowed", "error");
        return;
      }

      const previewBlob = URL.createObjectURL(file);

      setVslData({
        uploadData: file,
        previewBlob,
        type: fileType,
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  const _onSave = async (e) => {
    try {
      if (e) e.preventDefault();

      const newFormFields = { ...formFields };
      const newVslData = { ...vslData };
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

      const { firstName, lastName } = splitFullName(
        capitalize(newFormFields?.name?.trim())
      );

      const payload = {
        firstName,
        lastName,
        email: newFormFields?.email?.trim(),
        phone: newFormFields?.phone?.trim(),
        countryCode: newFormFields?.countryCode?.trim(),
        referCode: newFormFields?.referCode?.trim(),
        address: {
          Line1: newFormFields?.addressStreet?.trim(),
          City: newFormFields?.addressCity?.trim(),
          CountrySubDivisionCode: newFormFields?.addressState?.trim(), // state
          PostalCode: newFormFields?.addressZip?.trim(),
          Country: newFormFields?.addressCountry?.trim() || "US",
        },
        vsl: newVslData?.url || "",
      };

      if (newVslData?.uploadData) {
        const uploadFileOnServerRes = await uploadFileOnServer([
          { ...newVslData },
        ]);
        payload.vsl = uploadFileOnServerRes?.[0]?.url;
        newVslData.url = uploadFileOnServerRes?.[0]?.url;
        newVslData.uploadData = null;
        setVslData(newVslData);
      }

      if (data?._id) {
        // await updateAffiliate({ id: data?._id, payload });
      } else {
        // await createAffiliate(payload);
      }

      onSuccess();

      _closeModal();
    } catch (error) {
      errorHandler(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && data?._id) {
      _setModalState(data);
    }
  }, [isOpen, data]);

  return (
    <Modal
      isOpen={isOpen}
      scrollable
      centered
      size={"lg"}
      toggle={() => _closeModal()}
    >
      <ModalHeader toggle={() => _closeModal()}>New Group</ModalHeader>

      <ModalBody>
        <FormGroup>
          <Label>Group Name</Label>
          <Input
            placeholder="Enter"
            value={formFields.name}
            onChange={(e) => _onChangeFormFields("name", e.target.value)}
            onBlur={() => _onBlurFormFields("name")}
          />
          {errors["name"] ? (
            <div className="form-error">{errors["name"]}</div>
          ) : null}
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <Input
            type="textarea"
            placeholder="Enter"
            value={formFields.name}
            onChange={(e) => _onChangeFormFields("name", e.target.value)}
            onBlur={() => _onBlurFormFields("name")}
          />
          {errors["name"] ? (
            <div className="form-error">{errors["name"]}</div>
          ) : null}
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="link" className="closeBtn" onClick={() => _closeModal()}>
          Close
        </Button>
        <Button color="primary" disabled={loading} onClick={() => _onSave()}>
          {loading ? <i className="fa fa-spinner fa-spin" /> : null}{" "}
          {data?._id ? "Update" : "Add"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NewGroupModal;
