import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../../components/routes/ProtectedRoute";
import TabsDesign from "../../pages/protected/TabsDesign";
import MediaQueueViewer from "../MediaQueueViewer";
import DashboardFooter from "./DashboardFooter";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import GroupsPage from "../../pages/protected/Groups";
import GroupMembersPage from "../../pages/protected/GroupMembers";
import GroupMemberDetailsPage from "../../pages/protected/GroupMemberDetailsPage";
// import GroupChats from "../../pages/protected/GroupChats";

const DashboardLayout = ({ props }) => {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <div className="mainWrapper">
        <DashboardSidebar isShow={isShow} setIsShow={setIsShow} />
        <DashboardHeader isShow={isShow} setIsShow={setIsShow} />
        <div className="innerWrapper">
          <Routes>
            <Route
              path=""
              element={<ProtectedRoute redirectRoute={"/login"} />}
            >
              <Route exact path="/groups" element={<GroupsPage />} />
              <Route
                exact
                path="/group-members"
                element={<GroupMembersPage />}
              />
              <Route
                exact
                path="/group-member-details/:id"
                element={<GroupMemberDetailsPage />}
              />
              {/* <Route exact path="/group-chats" element={<GroupChats />} /> */}
              <Route exact path="/tabs" element={<TabsDesign />} />
            </Route>

            <Route path="*" element={<Navigate replace to="/groups" />} />
          </Routes>

          <MediaQueueViewer />
        </div>

        <DashboardFooter />
      </div>
    </>
  );
};

export default DashboardLayout;
