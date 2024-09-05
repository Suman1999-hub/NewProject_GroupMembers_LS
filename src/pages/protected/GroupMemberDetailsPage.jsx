import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import SvgIcons from "../../components/SvgIcons";
import { useNavigate, useParams } from "react-router-dom";
import {
  capitalize,
  copyToClipboard,
  deepClone,
  errorHandler,
  formatAddressInSingleText,
  getDropdownColor,
  getFullName,
  openUrlOnNewTab,
  showToast,
} from "../../helper-methods";
// import { getAffiliateById, updateAffiliate } from "../../http/http-calls";
import SkeletonLoading from "../../components/SkeletonLoading";
// import { useSelector } from "react-redux";
import { statusConfig } from "../../config/helper-config";
import CustomTooltip from "../../components/custom/CustomTooltip";
import SupportEmailModal from "../../components/modals/SupportEmailModal";
import ShareSocialMedia from "../../components/ShareSocialMedia";
import { BASE_URL } from "../../config";

const GroupMemberDetailsPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [data, setData] = useState(null);
  const [platformEngagement, setPlatformEngagement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [loadingState, setLoadingState] = useState({
    data: false,
  });

  const [supportEmailModal, setSupportEmailModal] = useState({
    isOpen: false,
    data: null,
  });

  const _toggle = (isOpen = false) => {
    setIsOpen(isOpen);
  };

  const _manageLoadingState = (key = "", value = false) => {
    setLoadingState((prev) => ({ ...prev, [key]: value }));
  };

  const _toggleSupportEmailModal = (isOpen = false, data = null) => {
    setSupportEmailModal({ isOpen, data });
  };

  const _onChangeStatus = async (each, status) => {
    try {
      if (!each?._id) {
        errorHandler({ reason: "Data not found" });
        return;
      }

      _manageLoadingState("status", true);

      const payload = {
        isActive: status === "Active" ? true : false,
      };

      const newData = deepClone(data);
      newData.isActive = payload.isActive;
      setData(newData);

      // await updateAffiliate({ id: each?._id, payload });

      _manageLoadingState("status", false);

      showToast("Status has been updated", "success");
    } catch (error) {
      errorHandler(error);
      _manageLoadingState("status", false);
      _getAffiliateById();
    }
  };

  const _getAffiliateById = async () => {
    try {
      _manageLoadingState("data", true);

      // const res = await getAffiliateById(
      //   params?.id || userCredential?.user?._id
      // );

      const res = {};

      setData(res?.user);

      setPlatformEngagement(res?.platformEngagement);

      _manageLoadingState("data", false);
    } catch (error) {
      errorHandler({ reason: "User not found" });
      _manageLoadingState("data", false);
      navigate(-1);
    }
  };

  useEffect(() => {
    _getAffiliateById();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="innerHeader">
        <div className="backToPage">
          {params?.id ? (
            <>
              <Button color="link" onClick={() => navigate(-1)}>
                <SvgIcons type={"backArrow"} />
              </Button>
              <h2>Ladder UPP Group member details</h2>
            </>
          ) : (
            <>
              <h2>Group Member</h2>
            </>
          )}
        </div>
      </div>

      {loadingState?.data && !data ? (
        <SkeletonLoading type="detailPage" />
      ) : (
        <>
          <Row className="justify-content-center">
            <Col md="5">
              <section>
                <Card className="cardDesign">
                  <CardHeader>
                    <CardTitle>Personal Info</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className="infoWrap">
                      <ul>
                        <li>
                          <span>Name</span>
                          <div className="inotItem">
                            <SvgIcons type={"user"} />
                            Jordan
                          </div>
                        </li>
                        <li>
                          <span>Email</span>
                          <div className="inotItem">
                            <SvgIcons type={"email"} />
                            jordan@gmail.com
                          </div>
                        </li>
                        <li>
                          <span>Phone Number</span>
                          <div className="inotItem">
                            <SvgIcons type={"phone"} />
                            +1 9087654321
                          </div>
                        </li>

                        <li>
                          <span>Group</span>
                          <div className="inotItem">
                            <SvgIcons type={"userGroup"} />
                            Group 1
                          </div>
                        </li>
                        <li>
                          <span>User Type</span>
                          <div className="inotItem">
                            <SvgIcons type={"user"} />
                            Member
                          </div>
                        </li>
                        <li>
                          <span>Goals Achieved</span>
                          <div className="inotItem">
                            <SvgIcons type="achieved" />5
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardBody>
                </Card>
              </section>
            </Col>

            <Col md="7">
              <section>
                <h5>
                  Life Mission Statement
                  <Badge color="primary" className="ms-2">
                    To become a surgeon
                  </Badge>
                </h5>

                <hr className="mt-0 mb-4"></hr>

                <div>
                  <h6>Short-Term Goals</h6>
                  <Card className="cardDesign">
                    <CardHeader>
                      <FormGroup
                        check
                        className="mb-0"
                        style={{ minHeight: "auto" }}
                      >
                        <Input
                          type="checkbox"
                          name="enrollProgram"
                          id="enrollShort"
                        />
                        <Label check for="enrollShort" className="mb-0 fs-16">
                          Enroll For the Program
                        </Label>
                      </FormGroup>
                      <SvgIcons type={"comments"} />
                    </CardHeader>
                    <CardBody>
                      <h6>Action Steps : </h6>
                      <ul className="mb-0">
                        <li>Fill the enrollment form</li>
                        <li>Pay the fees</li>
                        <li>Start the course</li>
                      </ul>
                    </CardBody>
                    <CardFooter>
                      <span>Due Date:</span> <strong>Today</strong>
                    </CardFooter>
                  </Card>
                </div>

                <div>
                  <h6>Long-Term Goals</h6>
                  <Card className="cardDesign">
                    <CardHeader>
                      <FormGroup
                        check
                        className="mb-0"
                        style={{ minHeight: "auto" }}
                      >
                        <Input
                          type="checkbox"
                          name="enrollProgram"
                          id="enrollLong"
                        />
                        <Label check for="enrollLong" className="mb-0 fs-16">
                          Enroll For the Program
                        </Label>
                      </FormGroup>
                      <SvgIcons type={"comments"} />
                    </CardHeader>
                    <CardBody>
                      <h6>Action Steps : </h6>
                      <ul className="mb-0">
                        <li>Fill the enrollment form</li>
                        <li>Pay the fees</li>
                        <li>Start the course</li>
                      </ul>
                    </CardBody>
                    <CardFooter>
                      <span>Due Date:</span> <strong>Today</strong>
                    </CardFooter>
                  </Card>
                </div>
              </section>
            </Col>
          </Row>
        </>
      )}

      <SupportEmailModal
        isOpen={supportEmailModal.isOpen}
        data={supportEmailModal.data}
        toggle={() => _toggleSupportEmailModal()}
      />
    </>
  );
};

export default GroupMemberDetailsPage;
