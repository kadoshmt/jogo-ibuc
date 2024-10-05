"use client";
import React from "react";
import { useRouter, useParams  } from 'next/navigation';

import { EditUserForm } from "./EditUserForm";
import withRoleProtection from "@/hoc/withRoleProtection";

const EditUserPageComponent = () => {
  const params = useParams();
  const userId = params.id as string;


  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 space-y-8">
          <EditUserForm userId={userId} />
        </div>
      </div>
    </>
  );
};

export default withRoleProtection(EditUserPageComponent, ['ADMIN']);
