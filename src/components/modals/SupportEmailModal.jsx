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
  // UncontrolledDropdown,
  // DropdownMenu,
  // DropdownToggle,
  // DropdownItem,
} from "reactstrap";
// import { templateVariablesConfig } from "../../config/templateConfig";
import { errorHandler, showToast } from "../../helper-methods";
// import { sendSupportEmail } from "../../http/http-calls";
import TextEditor from "../TextEditor";
// import { getAndUpdateTemplateList } from "../../redux/actions";
// import { useDispatch, useSelector } from "react-redux";
import SearchableInput from "../SearchableInput";

const SupportEmailModal = ({ isOpen, toggle }) => {
  // const dispatch = useDispatch();

  // const filtersList = useSelector((state) => state?.filtersList);

  const [formFields, setFormFields] = useState({
    template: "",
    subject: "",
    body: "",
  });
  // eslint-disable-next-line no-unused-vars
  const [isDirty, setIsDirty] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const filteredTemplateList = [];
  // useMemo(() => {
  //   return filtersList?.templateList?.length
  //     ? filtersList?.templateList.filter((each) => each.category === "Email")
  //     : [];
  // }, [filtersList?.templateList]);

  const _validateFormFields = ({ newFormFields, newIsDirty }) => {
    return new Promise((resolve) => {
      const newErrors = {};
      let isFormValid = true;

      if (newFormFields) {
        Object.keys(newFormFields).forEach((key) => {
          if (newIsDirty[key]) {
            switch (key) {
              case "subject": {
                if (newFormFields[key]?.trim().length) {
                  newErrors[key] = null;
                  newIsDirty[key] = false;
                } else {
                  newErrors[key] = "*Required";
                  isFormValid = false;
                }
                break;
              }
              case "body": {
                if (
                  newFormFields[key]?.trim().length &&
                  newFormFields[key] !== "<p><br></p>"
                ) {
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
      }

      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));

      setIsDirty((prev) => ({
        ...prev,
        ...newIsDirty,
      }));

      resolve(isFormValid);
    });
  };

  // const _onSelectVariable = (key, value) => {
  //   const newFormFields = { ...formFields };
  //   newFormFields[key] += value;
  //   setFormFields(newFormFields);

  //   const newIsDirty = { ...isDirty };
  //   newIsDirty[key] = true;
  //   _validateFormFields({ newFormFields, newIsDirty });
  // };

  const _onChangeFormFields = (key, value) => {
    const newFormFields = { ...formFields };

    if (key === "template" && value) {
      newFormFields.subject = value.subject || "";
      newFormFields.body = value.body || "";
    }

    newFormFields[key] = value;
    setFormFields(newFormFields);
  };

  const _onBlurFormFields = (key) => {
    const newFormFields = { ...formFields };
    const newIsDirty = {
      [key]: true,
    };
    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _setModalState = () => {
    setFormFields({
      template: "",
      subject: "",
      body: "",
    });
    setIsDirty({});
    setErrors({});
    setLoading(false);
  };

  const _closeModal = () => {
    _setModalState();
    toggle();
  };

  const _onSaveDetails = async () => {
    try {
      const newFormFields = { ...formFields };

      const newIsDirty = {
        subject: true,
        body: true,
      };

      const isFormValid = await _validateFormFields({
        newFormFields,
        newIsDirty,
      });

      if (!isFormValid) return;

      setLoading(true);

      const payload = {
        subject: formFields.subject.trim(),
        body: formFields.body.trim(),
      };

      console.log({ payload });
      // await sendSupportEmail(payload);

      showToast(
        "Thanks for contacting support! We'll connect with you shortly.",
        "success"
      );

      _closeModal();
    } catch (error) {
      setLoading(false);
      errorHandler(error);
    }
  };

  const _getAllTemplatesList = async () => {
    try {
      // await getAndUpdateTemplateList()(dispatch);
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      _getAllTemplatesList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => _closeModal()}
      scrollable
      centered
      backdrop="static"
    >
      <ModalHeader toggle={() => _closeModal()}>Contact Support</ModalHeader>

      <ModalBody>
        <FormGroup>
          <Label>Template</Label>
          <SearchableInput
            options={filteredTemplateList}
            value={formFields.template}
            onChange={(value) => _onChangeFormFields("template", value)}
          />
        </FormGroup>

        <FormGroup>
          <div className="messageVeriabel">
            <Label className="mb-0">Subject</Label>

            {/* <UncontrolledDropdown direction="down">
              <DropdownToggle caret>Insert Variables</DropdownToggle>
              <DropdownMenu end>
                {React.Children.toArray(
                  templateVariablesConfig.map((each) => (
                    <DropdownItem
                      onClick={() =>
                        _onSelectVariable("subject", each.variable)
                      }
                    >
                      {each.variable}
                    </DropdownItem>
                  ))
                )}
              </DropdownMenu>
            </UncontrolledDropdown> */}
          </div>

          <Input
            type="text"
            value={formFields.subject}
            name="subject"
            onChange={(e) => _onChangeFormFields("subject", e.target.value)}
            onBlur={() => _onBlurFormFields("subject")}
            disabled={loading}
          />
          {errors["subject"] ? (
            <div className="form-error">{errors["subject"]}</div>
          ) : null}
        </FormGroup>
        <FormGroup>
          <div className="messageVeriabel">
            <Label className="mb-0">Body</Label>

            {/* <UncontrolledDropdown direction="down">
              <DropdownToggle caret>Insert Variables</DropdownToggle>
              <DropdownMenu end>
                {React.Children.toArray(
                  templateVariablesConfig.map((each) => (
                    <DropdownItem
                      onClick={() => _onSelectVariable("body", each.variable)}
                    >
                      {each.variable}
                    </DropdownItem>
                  ))
                )}
              </DropdownMenu>
            </UncontrolledDropdown> */}
          </div>
          <TextEditor
            className="editorHeight"
            content={formFields.body}
            onChange={(value) => _onChangeFormFields("body", value)}
            onBlur={() => _onBlurFormFields("body")}
          />
          {errors["body"] ? (
            <div className="form-error">{errors["body"]}</div>
          ) : null}
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="link" className="closeBtn" onClick={() => _closeModal()}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => _onSaveDetails()}
          disabled={loading}
        >
          {loading ? <i className="fa fa-spinner fa-spin mr-2" /> : null} Send
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SupportEmailModal;
