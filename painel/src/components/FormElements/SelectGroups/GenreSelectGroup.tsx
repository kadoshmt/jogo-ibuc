"use client";
import { Genre } from "@/types/profile";
import { UsersIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState } from "react";

interface GenreSelectGroupProps {
  customClasses?: string;
  selectedOption?: string | Genre;
  isOptionSelected?: boolean;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const GenreSelectGroup: React.FC<GenreSelectGroupProps> = ({
  customClasses,
  selectedOption,
  isOptionSelected = false,
  required,
  onChange}) => {
  const [isOptionSelectedState, setIsOptionSelectedState] = useState<boolean>(isOptionSelected);

  const changeTextColor = () => {
    setIsOptionSelectedState(true);
  };

  return (
    <div className={customClasses}>
    <div className="mb-4.5">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        Sexo
        {required && <span className="text-red">*</span>}
      </label>

      <div className="relative z-20 rounded-[7px] bg-white dark:bg-dark-2">
      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
          <UsersIcon className="size-5" />
        </span>
        <select
          value={selectedOption}
          onChange={onChange}
          onBlur={(e) => {changeTextColor(); }}
          // onChange={(e) => {
          //   setSelectedOptionState(e.target.value);
          //   changeTextColor();
          // }}
          className={`relative z-10 w-full appearance-none rounded-[7px] border border-stroke text-dark bg-white px-11.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 ${
            isOptionSelectedState ? "text-dark dark:text-white" : ""
          }`}
        >
          <option value="" disabled className="text-dark-6">
            Selecione o sexo
          </option>
          <option value="MASCULINO" className="text-dark-6">
            Masculino
          </option>
          <option value="FEMININO" className="text-dark-6">
            Feminino
          </option>
          <option value="NAO_INFORMADO" className="text-dark-6">
            Não informado
          </option>
        </select>

        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <Image src={"/images/icon/icon-arrow-down.svg"} width={18} height={18} alt="seta para baixo" />
        </span>
      </div>
    </div>
    </div>
  );
};

export default GenreSelectGroup;
