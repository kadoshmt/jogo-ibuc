"use client";
import React from "react";

import { ProfileDataForm } from "./ProfileDataForm";
import { ProfileAvatarForm } from "./ProfileAvatarForm";
import { ProfileChangePasswordForm } from "./ProfileChangePasswordForm";
import { ProfileDeleteAccountForm } from "./ProfileDeleteAccountForm";

const ProfilePageComponent = () => {

  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        {/* Container Informações Pessoais */}
        <div className="col-span-5 xl:col-span-3 space-y-8">
          <ProfileDataForm />
          <ProfileAvatarForm />
        </div>

        {/* Container sua foto */}
        <div className="col-span-5 xl:col-span-2 space-y-8 ">

          <ProfileChangePasswordForm />
          <ProfileDeleteAccountForm />
        </div>

      </div>
    </>
  );
};

export default ProfilePageComponent;
