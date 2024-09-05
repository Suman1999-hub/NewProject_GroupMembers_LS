import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { navLinks } from "../../config/navLinks";
const DashboardSidebar = ({ isShow, setIsShow }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // menu
  const _isActiveTab = (route) => {
    return location?.pathname === route ? true : false;
  };

  const _toggleSidebar = () => {
    setIsShow(!isShow);
  };
  return (
    <>
      {/* add show class after click on bar icon  */}
      <div
        className={`sidebarWrapper ${isShow ? "show" : ""}`}
        onClick={() => _toggleSidebar()}
      >
        <div className="sidebarInner">
          <div className="userInfo">
            <div className="userAvatar">
              <img
                src={require("../../assets/img/default-profile.svg").default}
                alt="Profile"
              />
            </div>
            <div className="userName" onClick={() => navigate("/profile")}>
              <span>John Doe</span>
              <i className="fas fa-pencil-alt" />
            </div>
          </div>
          <div className="sidebarMenu">
            <ListGroup>
              {navLinks.map((each, index) => (
                <ListGroupItem
                  key={`navLinks_sidebar_${index}`}
                  className={_isActiveTab(each.link) ? "active" : ""}
                  onClick={() => navigate(each.link)}
                >
                  {each.label}
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
