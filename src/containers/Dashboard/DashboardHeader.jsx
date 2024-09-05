import React, { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Nav,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { logout } from "../../helper-methods";
import { APP_LOGO } from "../../config";
import { navLinks } from "../../config/navLinks";
import SvgIcons from "../../components/SvgIcons";

const DashboardHeader = ({ isShow, setIsShow }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const _logout = () => {
    logout(navigate);
  };
  // menu
  // const [isOpen, setIsOpen] = useState(false);
  // const toggle = () => setIsOpen(!isOpen);

  // menu
  const _isActiveTab = (route) => {
    return location?.pathname === route ? true : false;
  };

  const _toggleSidebar = () => {
    setIsShow(!isShow);
  };

  return (
    <Navbar expand="md" className="projectHeader" light>
      <NavbarBrand onClick={() => navigate("/")} className="order-1">
        <img src={APP_LOGO} alt="Logo" />
      </NavbarBrand>

      <Button
        onClick={() => _toggleSidebar()}
        className="order-md-1 toggleIcon "
      >
        <span></span>
      </Button>

      <Nav className="m-auto order-md-2 d-md-flex d-none" navbar>
        {navLinks.slice(0, 4).map((each, index) => (
          <NavItem key={`navLinks_header_${index}`}>
            <NavLink
              className={_isActiveTab(each.link) ? "active" : ""}
              onClick={() => navigate(each.link)}
            >
              {each.label}
            </NavLink>
          </NavItem>
        ))}

        {navLinks.slice(4)?.length ? (
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle
              nav
              className={
                navLinks.slice(4).some((each) => _isActiveTab(each.link))
                  ? "active"
                  : ""
              }
            >
              More <SvgIcons type="arrowDown" />
            </DropdownToggle>
            <DropdownMenu end>
              {navLinks.slice(4).map((each, index) => (
                <Fragment key={`navLinks_header_options_${index}`}>
                  <DropdownItem
                    className={_isActiveTab(each.link) ? "active" : ""}
                    onClick={() => navigate(each.link)}
                  >
                    {each.label}
                  </DropdownItem>
                  {/* {index < navLinks.slice(4).length - 1 ? (
                      <DropdownItem divider />
                    ) : null} */}
                </Fragment>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : null}
      </Nav>
      <div className="order-3">
        <Button onClick={() => _logout()} color="link " className="text-danger">
          <i className="fas fa-power-off" />
        </Button>
      </div>
    </Navbar>
  );
};

export default DashboardHeader;
