import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditUserPageComponent from "@/components/Pages/Users/Edit";

export const metadata: Metadata = {
  title: "Editar Usuário | IbUCGameAdmin",
  description: "Gerenciador de Contéudos do Jogo IBUC",
};

const EditUser = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Editar Usuário" />

        <EditUserPageComponent />
      </div>
    </DefaultLayout>
  );
};

export default EditUser;
