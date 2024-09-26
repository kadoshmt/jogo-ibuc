import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProfileEditBoxes from "@/components/Pages/ProfileEditBoxes";
import ProfilePageComponent from "@/components/Pages/Profile";

export const metadata: Metadata = {
  title: "Next.js Profile Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Profile page for NextAdmin Dashboard Kit",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Meu Perfil" />

        <ProfilePageComponent />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
