"use client";
import { Genre } from "@/types/profile";
import { UsersIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

interface GenreSelectGroupProps {
  customClasses?: string;
  selectedOption?: string | Genre;
  isOptionSelected?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const GenreSelectGroup: React.FC<GenreSelectGroupProps> = ({customClasses, selectedOption, isOptionSelected = false, onChange}) => {
  const [isOptionSelectedState, setIsOptionSelectedState] = useState<boolean>(isOptionSelected);

  const changeTextColor = () => {
    setIsOptionSelectedState(true);
  };

  return (
    <div className={customClasses}>
    <div className="mb-4.5">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        Sexo
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
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.99922 12.8249C8.83047 12.8249 8.68984 12.7687 8.54922 12.6562L2.08047 6.2999C1.82734 6.04678 1.82734 5.65303 2.08047 5.3999C2.33359 5.14678 2.72734 5.14678 2.98047 5.3999L8.99922 11.278L15.018 5.34365C15.2711 5.09053 15.6648 5.09053 15.918 5.34365C16.1711 5.59678 16.1711 5.99053 15.918 6.24365L9.44922 12.5999C9.30859 12.7405 9.16797 12.8249 8.99922 12.8249Z"
              fill=""
            />
          </svg>
        </span>
      </div>
    </div>
    </div>
  );
};

export default GenreSelectGroup;
