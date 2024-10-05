import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProfilePageComponent from "@/components/Pages/Profile";

export const metadata: Metadata = {
  title: "Meu Perfil | IbUCGameAdmin",
  description: "Gerenciador de Contéudos do Jogo IBUC",
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
