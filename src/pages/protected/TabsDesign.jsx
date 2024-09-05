import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap";
import ExampleComponent from "../../components/ExampleComponent";

const TabsDesign = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("1");
  const _toggleTab = (newTab = "1") => {
    if (activeTab !== newTab) setActiveTab(newTab);
  };

  return (
    <>
      <div className="innerHeader">
        <h2>
          <Button color="link" onClick={() => navigate(-1)}>
            <i className="fas fa-chevron-left" />
          </Button>
          Tabs
        </h2>
      </div>

      <div className="main_content_wrapper">
        <Nav pills>
          <NavItem>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => _toggleTab("1")}
            >
              Tab
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => _toggleTab("2")}
            >
              More Tabs
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <ExampleComponent />
          </TabPane>
          <TabPane tabId="2">asd</TabPane>
        </TabContent>
      </div>

      {/* card */}
      <Row className="mt-4">
        <Col md={3}>
          <Card>
            <CardHeader>Header</CardHeader>
            <CardBody>
              <CardTitle tag="h5">Special Title Treatment</CardTitle>
              <CardText>
                With supporting text below as a natural lead-in to additional
                content.
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TabsDesign;
