"use client";
import React from "react";

import { ProfileDataForm } from "./ProfileDataForm";
import { ProfileAvatarForm } from "./ProfileAvatarForm";
import { ProfileChangePasswordForm } from "./ProfileChangePasswordForm";
import { ProfileDeleteAccountForm } from "./ProfileDeleteAccountForm";
import { useCheckPassword } from "@/hooks/useProfile";
import { ProfileCreatePasswordForm } from "./ProfileCreatePasswordForm";

const ProfilePageComponent = () => {
  const {data: userCheckPassword} = useCheckPassword();

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

          {userCheckPassword?.wasProvided &&(<ProfileChangePasswordForm />)}
          {!userCheckPassword?.wasProvided &&(<ProfileCreatePasswordForm />)}
          <ProfileDeleteAccountForm />
        </div>

      </div>
    </>
  );
};

export default ProfilePageComponent;
