import React, { useEffect, useRef, useState } from "react";
import { findMembers } from "../../http/http-calls";
import {
  Button,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  Table,
  UncontrolledTooltip,
} from "reactstrap";
import PaginatedItems from "../../components/PaginatedItems";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import NewGroupModal from "../../components/modals/NewGroupModal";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { useDebounce } from "../../custom-hook/useDebounce";
import { current } from "@reduxjs/toolkit";

const GroupMembersPage = () => {
  const [totalCount, setTotalCount] = useState();
  const [users, setUsers] = useState([]);
  const [goals, setGoals] = useState([]);
  const [payload, setPayload] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const totalUsers = Array(totalCount).fill("user");

  const isMounted = useRef(false);
  const fetchData = async (page = 1) => {
    try {
      const data = await findMembers(payload);
      setTotalCount(data.userCount);
      setUsers(data.user);
      setGoals(data.goals);
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const _handleFilter = (field, value) => {
    console.log("field >", field);
    console.log("event >", value);
    console.log("typeOf", value?.length);
    let updatedPayload = { ...payload };
    if (typeof value === "number") {
      updatedPayload[field] = value;
    } else if (value?.length) {
      updatedPayload[field] = value;
      setCurrentPage(1);
      updatedPayload["page"] = 1;
      delete updatedPayload["page"];
    } else {
      delete updatedPayload[field];
    }
    setPayload(updatedPayload);
  };
  const debounceText = useDebounce(searchValue, 2000);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("page >>", page);
    _handleFilter("page", page);
  };

  const handleReset = () => {
    //const reset = { status: undefined, page: undefined, search: undefined };
    setPayload({});
    setSearchValue(undefined);
    setCurrentPage(1);

    //_handleFilter(...payload);
  };
  useEffect(() => {
    // if (debounceText?.length) {
    if (isMounted?.current) {
      _handleFilter("search", debounceText);
    } else {
      isMounted.current = true;
    }
    // }
  }, [debounceText]);

  useEffect(() => {
    fetchData(currentPage);
  }, [payload, currentPage]);
  console.log("payload >>", payload);
  return (
    <>
      <div className="innerHeader">
        <h2>Ladder UPP Group Members</h2>
      </div>
      <div className="filterWrapper">
        <div className="filterIcon">
          <i className="fas fa-filter" />
        </div>
        <div className="filterForm">
          <div className="formGroup searchbar">
            <Label>Search</Label>
            <InputGroup>
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <InputGroupText>
                <i className="fas fa-search" />
              </InputGroupText>
            </InputGroup>
          </div>
          <div className="formGroup">
            <Label>Added Date</Label>
            <CustomDateRangePicker />
          </div>
          <div className="formGroup">
            <Label>Invite Status</Label>
            <Input
              type="select"
              value={payload.status || ""}
              onChange={(event) => _handleFilter("status", event.target.value)}
            >
              <option value="">All</option>
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
            </Input>
          </div>
          <div className="formGroup">
            <Label>Group</Label>
            <Input type="select">
              <option>All</option>
            </Input>
          </div>
          <div className="formGroup">
            <Label>User Type</Label>
            <Input type="select">
              <option>All</option>
            </Input>
          </div>
          <div className="formGroup" style={{ marginTop: "29px" }}>
            {payload.search !== undefined || payload.status !== undefined ? (
              <Button onClick={() => handleReset()}>
                <i
                  role="button"
                  className="fa fa-light fa-eraser"
                  style={{ color: "red", height: "15px" }}
                ></i>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="bg-white p-2 mt-4" style={{ borderRadius: 8 }}>
        <Table responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Added On</th>
              <th>Group</th>
              <th>User Type</th>
              <th>Goals Achieved</th>
              <th style={{ width: 150, textAlign: "right" }}>Invite Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <NavLink to="/group-member-details/2">
                    {user.name.full}
                  </NavLink>
                  <div className="action mt-1">
                    <Button
                      color="link"
                      id={`UncontrolledTooltipExample1${user.id}`}
                      className="p-0"
                    >
                      <i
                        role="button"
                        className="fa fa-phone-alt p-2 fs-12"
                      ></i>
                    </Button>
                    <Button
                      color="link"
                      id={`UncontrolledTooltipExample2${user.id}`}
                      className="p-0"
                    >
                      <i role="button" className="fa fa-envelope p-2 fs-14"></i>
                    </Button>
                    <UncontrolledTooltip
                      placement="right"
                      target={`UncontrolledTooltipExample1${user.id}`}
                    >
                      {user.phone}
                    </UncontrolledTooltip>
                    <UncontrolledTooltip
                      placement="right"
                      target={`UncontrolledTooltipExample2${user.id}`}
                    >
                      {user.email}
                    </UncontrolledTooltip>
                  </div>
                </td>
                <td>{moment(user.createdAt).format("DD MMM, YYYY")}</td>
                <td>{user._groups.map((group) => group.name).join(", ")}</td>
                <td>{user.permissionGroup}</td>
                <td>
                  {
                    goals.filter(
                      (data) =>
                        data._createdBy === user.id && data.isCompleted === true
                    ).length
                  }
                </td>
                <td style={{ width: 100, textAlign: "right" }}>
                  <div className="action">
                    {user.status === "pending" ? (
                      <Button color="primary" outline>
                        Pending
                      </Button>
                    ) : (
                      <Button color="success">Accepted</Button>
                    )}
                    {/* <Button color="primary" outline>
                      Send Reminder
                    </Button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <PaginatedItems
        onPageChange={handlePageChange}
        onItemsChange={(value) => console.log(value)}
        items={totalUsers}
        currentPage={currentPage}
        itemsPerPage={10}
      />
    </>
  );
};
export default GroupMembersPage;
