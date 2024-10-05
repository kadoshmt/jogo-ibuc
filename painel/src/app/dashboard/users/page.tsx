import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UsersListPageComponent from "@/components/Pages/Users/List";

export const metadata: Metadata = {
  title: "Listar Usuários | IbUCGameAdmin",
  description: "Gerenciador de Contéudos do Jogo IBUC",
};

const UsersList = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Listar Usuários" />
    
        <UsersListPageComponent />
      </div>
    </DefaultLayout>
  );
};

export default UsersList;
