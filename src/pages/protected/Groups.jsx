import React, { useEffect, useState } from "react";
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
import TextEditor from "../../components/TextEditor";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import NewGroupModal from "../../components/modals/NewGroupModal";
import InviteMembersModal from "../../components/modals/InviteMembersModal";
import { findAllGroups } from "../../http/http-calls";

const GroupsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInviteMember, setInviteMember] = useState(false);
  const [groupsData, setGroupsData] = useState({});

  const _toggle = (isOpen = false) => {
    setIsOpen(isOpen);
  };

  const _toggleInviteMember = (isInviteMember = false) => {
    setInviteMember(isInviteMember);
  };

  // date range
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: null,
      endDate: null,
    },
    dateType: "",
  });

  const _onDatesChange = ({ startDate, endDate, dateType }) => {
    const newFilters = { ...filters };

    newFilters["dateRange"] = {
      startDate,
      endDate,
    };
    newFilters.dateType = dateType;

    setFilters(newFilters);

    if ((!startDate && !endDate) || (startDate && endDate)) {
      // _onFiltersUpdated(newFilters); // api hit
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const storedData = localStorage.getItem("root");
        if (storedData) {
          const payload = JSON.parse(storedData);
          const response = await findAllGroups(payload);
          setGroupsData(response);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchGroups();
  }, []);
  console.log(groupsData);

  return (
    <>
      <div className="innerHeader">
        {/* page title */}
        <h2>Ladder UPP Groups</h2>

        <div className="right">
          <Button onClick={() => _toggle(true)} color="primary">
            Add Groups
          </Button>
        </div>
      </div>

      {/* filter */}
      <div className="filterWrapper">
        <div className="filterIcon">
          <i className="fas fa-filter" />
        </div>

        <div className="filterForm">
          {/* search */}
          <div className="formGroup searchbar">
            <Label>Search</Label>
            <InputGroup>
              <Input placeholder="Search..." />
              <InputGroupText>
                <i className="fas fa-search" />
              </InputGroupText>
            </InputGroup>
          </div>

          <div className="formGroup">
            <Label>Date</Label>
            <CustomDateRangePicker
              startDate={filters.dateRange.startDate}
              endDate={filters.dateRange.endDate}
              startDateId={"startDate_kpi_dashboard"}
              endDateId={`endDate_kpi_dashboard`}
              onDatesChange={_onDatesChange}
              dateType={filters.dateType}
            />
          </div>

          <div className="formGroup">
            <Label>Members</Label>
            <Input type="select">
              <option>All</option>
              <option>Kailash</option>
              <option>Anshumant</option>
              <option>Antareep</option>
            </Input>
          </div>
        </div>
      </div>

      <div className="bg-white p-2 mt-4" style={{ borderRadius: 8 }}>
        <Table responsive>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Description</th>
              <th>Added On</th>
              <th>Members</th>
              <th>Admin</th>
              <th>Facilitator(s)</th>
              <th style={{ width: 150, textAlign: "right" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Group 1</td>
              <td>
                <div className="tdDesc">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Quisquam porro asperiores tempore? Totam sequi vitae alias
                  porro nemo, dolore culpa rem molestias a et. Aperiam
                  recusandae dolorum cupiditate? Natus, nulla?
                </div>
              </td>
              <td>27 Feb, 2020</td>
              <td>10</td>
              <td>Jake</td>

              <td>
                John, Jade,{" "}
                <span
                  role="button"
                  id="UncontrolledTooltipExample"
                  className="text-primary px-1 py-2"
                >
                  +2
                </span>
                <UncontrolledTooltip
                  placement="right"
                  target="UncontrolledTooltipExample"
                >
                  <ul className="ps-3 mb-0">
                    <li>Antareep</li>
                    <li>Shivam</li>
                  </ul>
                </UncontrolledTooltip>
              </td>
              <td style={{ width: 100, textAlign: "right" }}>
                <div className="action">
                  <Button color="link" className="edit">
                    <i className="fas fa-pencil-alt" />
                  </Button>
                  <Button
                    color="primary"
                    outline
                    onClick={() => _toggleInviteMember(true)}
                  >
                    Invite
                  </Button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Group 1</td>
              <td>
                <div className="tdDesc">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Quisquam porro asperiores tempore? Totam sequi vitae alias
                  porro nemo, dolore culpa rem molestias a et. Aperiam
                  recusandae dolorum cupiditate? Natus, nulla?
                </div>
              </td>
              <td>27 Feb, 2020</td>
              <td>10</td>
              <td>Jake</td>

              <td>
                John, Jade,{" "}
                <span
                  role="button"
                  id="UncontrolledTooltipExample"
                  className="text-primary px-1 py-2"
                >
                  +2
                </span>
                <UncontrolledTooltip
                  placement="right"
                  target="UncontrolledTooltipExample"
                >
                  <ul className="ps-3 mb-0">
                    <li>Antareep</li>
                    <li>Shivam</li>
                  </ul>
                </UncontrolledTooltip>
              </td>
              <td style={{ width: 100, textAlign: "right" }}>
                <div className="action">
                  <Button color="link" className="edit">
                    <i className="fas fa-pencil-alt" />
                  </Button>
                  <Button
                    color="primary"
                    outline
                    onClick={() => _toggleInviteMember(true)}
                  >
                    Invite
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

      {/* pagination */}
      <PaginatedItems itemsPerPage={4} />

      <NewGroupModal isOpen={isOpen} toggle={() => _toggle()} />
      <InviteMembersModal
        isOpen={isInviteMember}
        toggle={() => _toggleInviteMember()}
      />
    </>
  );
};

export default GroupsPage;
