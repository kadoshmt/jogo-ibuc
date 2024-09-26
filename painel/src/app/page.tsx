import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import ECommerce from "@/components/Dashboard/E-commerce";

export const metadata: Metadata = {
  title:
    "Dashboard Page | IbUCGameAdmin",
  description: "Gerenciador de Contéudos do Jogo IBUC",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
