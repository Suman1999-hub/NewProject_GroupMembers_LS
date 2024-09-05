import React, { useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  Label,
  FormGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  deepClone,
  errorHandler,
  showToast,
  uploadFileOnServer,
} from "../helper-methods";
import { sendEmailTextToUsers } from "../http/http-calls";
import TextEditor from "./TextEditor";
import SvgIcons from "./SvgIcons";
import { templateVariablesConfig } from "../config/templateConfig";

const SendEmailTextComponent = ({
  isSelectAll = false,
  userType = "Lead", // enum = ["Lead", "Affiliate"]
  selectedDataIds = [],
  setSelectedDataIds = () => {},
  setIsSelectAll = () => {},
}) => {
  const [bulkMessage, setBulkMessage] = useState({
    type: "Email", // or Text or notification
    subject: "",
    message: "",
  });
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(["Email"]);
  const [imageFiles, setImageFiles] = useState([]);

  const _onChangeBulkMessage = (key, value) => {
    const newBulkMessage = { ...bulkMessage };
    if (key === "type") {
      newBulkMessage.subject = "";
      newBulkMessage.message = "";
    }
    newBulkMessage[key] = value;
    setBulkMessage(newBulkMessage);
  };

  const _onSelectVariable = (key, value) => {
    const newFormFields = { ...bulkMessage };
    newFormFields[key] += value;
    setBulkMessage(newFormFields);
  };

  const _handleChangeCheckbox = (event) => {
    const value = event.target.value;

    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(value)) {
        return prevSelectedOptions.filter((option) => option !== value);
      } else {
        return [...prevSelectedOptions, value];
      }
    });
  };

  const _handleFileUpload = (event) => {
    const newImageData = [...imageFiles];
    let allFiles = [];

    for (let index = 0; index < event.target.files.length; index++) {
      const element = event.target.files[index];
      allFiles.push(element);
    }
    setImageFiles([...newImageData, ...allFiles]);
  };

  const _deleteAfile = (index) => {
    let newImageData = deepClone(imageFiles);

    if (Array.isArray(newImageData)) {
      newImageData = newImageData
        .slice(0, index)
        .concat(newImageData.slice(index + 1));
    }
    setImageFiles(newImageData);
  };

  const _sendBulkMessage = async () => {
    try {
      let newBulkMessage = { ...bulkMessage };

      if (
        newBulkMessage.type === "Email" &&
        !newBulkMessage.subject &&
        userType === "Lead"
      ) {
        showToast("Please enter the subject", "error");
        return;
      }

      if (!newBulkMessage.message) {
        showToast("Please enter the message", "error");
        return;
      }

      if (!selectedDataIds?.length) {
        showToast("Please select clients", "error");
        return;
      }

      setSendMessageLoading(true);

      if (
        (newBulkMessage.type === "Email" ||
          selectedOptions.includes("Email")) &&
        !selectedOptions.includes("Notification") &&
        newBulkMessage.type !== "Text"
      ) {
        const payload = {
          isSelectAll: false,
          to: [],
          subject: newBulkMessage.subject,
          body: newBulkMessage.message,
          messageType: "Email",
          userType, // enum = ["Lead", "Affiliate"]
        };

        if (isSelectAll) {
          payload.isSelectAll = true;
        } else {
          payload.to = [...selectedDataIds];
        }

        if (imageFiles?.length) {
          let fileUploadPayload = imageFiles.map((data) => {
            let uploadData;
            uploadData = data;
            return { uploadData };
          });

          const res = await uploadFileOnServer(fileUploadPayload);
          await sendEmailTextToUsers({
            ...payload,
            attachmentDetails: res,
            isAttachment: true,
          });
        } else {
          await sendEmailTextToUsers(payload);
        }

        showToast("Email has been sent", "success");
      } else if (newBulkMessage.type === "Text") {
        const payload = {
          to: [...selectedDataIds],
          body: newBulkMessage.message,
          messageType: "Text",
          userType, // enum = ["Lead", "Affiliate"]
        };

        await sendEmailTextToUsers(payload);

        showToast("Sms has been sent", "success");
      } else if (!selectedOptions.includes("Email")) {
        const payload = {
          to: [...selectedDataIds],
          body: newBulkMessage.message,
          messageType: "Notification",
          userType, // enum = ["Lead", "Affiliate"]
        };

        if (imageFiles?.length) {
          let fileUploadPayload = imageFiles.map((data) => {
            let uploadData;
            uploadData = data;
            return { uploadData };
          });

          const res = await uploadFileOnServer(fileUploadPayload);
          await sendEmailTextToUsers({
            ...payload,
            attachmentDetails: res,
            isAttachment: true,
          });
        } else {
          await sendEmailTextToUsers(payload);
        }
        showToast("Notification has been sent", "success");
      } else {
        const payload = {
          to: [...selectedDataIds],
          body: newBulkMessage.message,
          title: newBulkMessage.subject,
          messageType: "Both",
          userType, // enum = ["Lead", "Affiliate"]
        };

        if (imageFiles?.length) {
          let fileUploadPayload = imageFiles.map((data) => {
            let uploadData;
            uploadData = data;
            return { uploadData };
          });

          const res = await uploadFileOnServer(fileUploadPayload);
          await sendEmailTextToUsers({
            ...payload,
            attachmentDetails: res,
            isAttachment: true,
          });
        } else {
          await sendEmailTextToUsers(payload);
        }
        showToast("Email and Notification has been sent", "success");
      }

      newBulkMessage = {
        type: "Email", // or Text or notification
        subject: "",
        message: "",
      };

      setBulkMessage(newBulkMessage);
      setSelectedDataIds([]);
      setIsSelectAll(false);

      setSendMessageLoading(false);
    } catch (error) {
      errorHandler(error);
      setSendMessageLoading(false);
    }
  };

  return (
    <>
      <div className="box-container cardWrap mt-4">
        <h2 className="fs-20 mb-3">Contact</h2>

        <Row>
          <Col md="2">
            {userType === "Lead" ? (
              <div className="FormGroup">
                <Input
                  type="select"
                  value={bulkMessage.type}
                  name="type"
                  onChange={(e) => _onChangeBulkMessage("type", e.target.value)}
                  disabled={sendMessageLoading}
                >
                  <option value="Email">Email</option>
                  <option value="Text">Text Message</option>
                </Input>
              </div>
            ) : (
              <>
                <FormGroup check inline>
                  <Input
                    type="checkbox"
                    value="Email"
                    checked={selectedOptions.includes("Email")}
                    onChange={(event) => _handleChangeCheckbox(event)}
                  />
                  <Label check> Email</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    type="checkbox"
                    value="Notification"
                    checked={selectedOptions.includes("Notification")}
                    onChange={(event) => _handleChangeCheckbox(event)}
                  />
                  <Label check>Notification</Label>
                </FormGroup>
              </>
            )}
          </Col>

          <Col md={10}>
            {selectedOptions?.length &&
            bulkMessage.type === "Email" &&
            ((selectedOptions.includes("Notification") && //here check if both check or check only emails
              selectedOptions.includes("Email")) ||
              !selectedOptions.includes("Notification")) ? (
              <>
                <FormGroup>
                  <div className="labelWithVariables">
                    <Label>Subject</Label>
                    <UncontrolledDropdown>
                      <DropdownToggle caret>Insert Variables</DropdownToggle>
                      <DropdownMenu end>
                        {React?.Children?.toArray(
                          templateVariablesConfig?.map((each) => (
                            <DropdownItem
                              onClick={() =>
                                _onSelectVariable("subject", each.variable)
                              }
                            >
                              {each?.variable}
                            </DropdownItem>
                          ))
                        )}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                  <Input
                    placeholder="Enter"
                    value={bulkMessage.subject}
                    disabled={sendMessageLoading}
                    onChange={(e) =>
                      _onChangeBulkMessage("subject", e.target.value)
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <div className="labelWithVariables">
                    <Label>Body</Label>
                    <UncontrolledDropdown>
                      <DropdownToggle caret>Insert Variables</DropdownToggle>
                      <DropdownMenu end>
                        {React.Children.toArray(
                          templateVariablesConfig.map((each) => (
                            <DropdownItem
                              onClick={() =>
                                _onSelectVariable("message", each.variable)
                              }
                            >
                              {each.variable}
                            </DropdownItem>
                          ))
                        )}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                  <TextEditor
                    className="editorHeight"
                    content={bulkMessage.message}
                    disabled={sendMessageLoading}
                    onChange={(value) => _onChangeBulkMessage("message", value)}
                  />
                </FormGroup>

                {userType === "Affiliate" ? (
                  <Label className="uploadFile mt-3">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => _handleFileUpload(event)}
                    />

                    <SvgIcons type={"upload"} />
                  </Label>
                ) : null}

                <div className="uploadBody">
                  <div className="UploadContent">
                    {imageFiles?.length
                      ? imageFiles?.map((file, index) => (
                          <div className="uploadItem" key={index}>
                            <img src={URL.createObjectURL(file)} alt="file" />
                            <div
                              className="deleteIcon"
                              onClick={() => _deleteAfile(index)}
                            >
                              <SvgIcons type={"remove"} />
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              </>
            ) : bulkMessage.type === "Text" ? (
              <FormGroup>
                <Label>Message</Label>
                <Input
                  type="textarea"
                  rows="3"
                  value={bulkMessage.message}
                  disabled={sendMessageLoading}
                  placeholder="Enter message here"
                  onChange={(e) =>
                    _onChangeBulkMessage("message", e.target.value)
                  }
                />
              </FormGroup>
            ) : (
              <>
                <FormGroup>
                  <Label>Message</Label>
                  <Input
                    type="textarea"
                    rows="3"
                    value={bulkMessage.message}
                    disabled={sendMessageLoading}
                    placeholder="Enter message here"
                    onChange={(e) =>
                      _onChangeBulkMessage("message", e.target.value)
                    }
                  />
                </FormGroup>
                {userType === "Affiliate" ? (
                  <Label className="uploadFile mt-3">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => _handleFileUpload(event)}
                    />

                    <SvgIcons type={"upload"} />
                  </Label>
                ) : null}

                <div className="uploadBody">
                  <div className="UploadContent">
                    {imageFiles?.length
                      ? imageFiles?.map((file, index) => (
                          <div className="uploadItem" key={index}>
                            <img src={URL.createObjectURL(file)} alt="file" />
                            <div
                              className="deleteIcon"
                              onClick={() => _deleteAfile(index)}
                            >
                              <SvgIcons type={"remove"} />
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              </>
            )}

            <Button
              color="primary"
              size="md"
              disabled={sendMessageLoading}
              onClick={() => _sendBulkMessage()}
            >
              {sendMessageLoading ? (
                <i className="fa fa-spinner fa-spin mr-1" />
              ) : null}{" "}
              Send
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SendEmailTextComponent;
