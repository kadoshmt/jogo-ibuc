import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import SigninPageComponent from "@/components/Pages/Signin";

export const metadata: Metadata = {
  title: "Login | IBUCGameAdmin",
  description: "Página de autenticação para o Painel Administrativo do Jogo do IBUC",
};

const SignIn: React.FC = () => {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="flex flex-wrap items-center">
              <div className="w-full xl:w-1/2">
                <div className="w-full p-4 sm:p-12.5 xl:p-15">
                <Link className="flex justify-center md:hidden my-12" href="/">
                  <Image
                      className="hidden dark:block"
                      src={"/images/logo/logo-ibuc.png"}
                      alt="Logo IBUC"
                      width={168}
                      height={100}
                      priority={true}
                      style={{ width: "auto", height: "auto" }}
                    />
                    <Image
                      className="dark:hidden"
                      src={"/images/logo/logo-ibuc.png"}
                      alt="Logo IBUC"
                      width={168}
                      height={100}
                      priority={true}
                      style={{ width: "auto", height: "auto" }}
                    />
                  </Link>
                  <SigninPageComponent />
                </div>
              </div>

              <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
                <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
                  <Link className="mb-10 inline-block" href="/">
                    <Image
                      className="hidden dark:block"
                      src={"/images/logo/logo-ibuc.png"}
                      alt="Logo IBUC"
                      width={168}
                      height={100}
                      priority={true}
                      style={{ width: "auto", height: "auto" }}
                    />
                    <Image
                      className="dark:hidden"
                      src={"/images/logo/logo-ibuc.png"}
                      alt="Logo IBUC"
                      width={168}
                      height={100}
                      priority={true}
                      style={{ width: "auto", height: "auto" }}
                    />
                  </Link>
                  <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                    Entre na sua conta
                  </p>

                  <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                    Bem vindo de volta!
                  </h1>

                  <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                    Por favor, faça login na sua conta preenchendo os campos necessários
                  </p>

                  <div className="mt-31">
                    <Image
                      src={"/images/grids/grid-02.svg"}
                      alt="Logo"
                      width={405}
                      height={325}
                      className="mx-auto dark:opacity-30"
                      priority={false}
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default SignIn;
