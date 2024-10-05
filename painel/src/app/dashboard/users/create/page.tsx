import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CreateUserPageComponent from "@/components/Pages/Users/Create";

export const metadata: Metadata = {
  title: "Criar Usuário | IbUCGameAdmin",
  description: "Gerenciador de Contéudos do Jogo IBUC",
};

const Createuser = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Criar Usuário" />

        <CreateUserPageComponent />
      </div>
    </DefaultLayout>
  );
};

export default Createuser;
