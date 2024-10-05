"use client";
import React from "react";
import { UsersListTable } from "./UsersListTable";
import { UsersListDataTable } from "./UsersListDataTable";
import withRoleProtection from "@/hoc/withRoleProtection";

const UsersListPageComponent = () => {

  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 space-y-8">
          {/* <UsersListTable /> */}
          <UsersListDataTable />
        </div>

      </div>
    </>
  );
};

export default withRoleProtection(UsersListPageComponent, ['ADMIN']);
