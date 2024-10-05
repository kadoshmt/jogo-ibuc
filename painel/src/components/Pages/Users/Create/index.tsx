"use client";
import React from "react";
import { CreateUserForm } from "./CreateUserForm";
import withRoleProtection from '@/hoc/withRoleProtection';

const CreateUserPageComponent = () => {

  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 space-y-8">
          <CreateUserForm />
        </div>
      </div>
    </>
  );
};

export default withRoleProtection(CreateUserPageComponent, ['ADMIN']);
