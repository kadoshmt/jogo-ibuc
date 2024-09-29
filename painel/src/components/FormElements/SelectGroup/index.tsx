"use client";
import React, { SelectHTMLAttributes } from "react";
import Image from "next/image";

interface SelectGroupProps<T>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "defaultValue"> {
  customClasses?: string;
  label?: string;
  icon?: React.ReactNode;
  options: T[];
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string | number;
  value?: string | number;
  defaultValue?: string | number;
}

const SelectGroup = <T,>({
  customClasses,
  label,
  required,
  icon,
  options,
  getOptionLabel,
  getOptionValue,
  value,
  defaultValue,
  ...selectProps
}: SelectGroupProps<T>) => {
  // Determinar se uma opção foi selecionada com base no valor atual
  const isOptionSelected = !!value && value !== "";

  return (
    <div className={customClasses}>
        {label && (
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {label}
            {required && <span className="text-red">*</span>}
          </label>
        )}

        <div className="relative z-20 rounded-[7px] bg-white dark:bg-dark-2">
          {icon && (
            <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
              {icon}
            </span>
          )}
          <select
            {...selectProps}
            required={required}
            value={value}
            defaultValue={defaultValue}
            className={`relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-white px-11.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 ${
              isOptionSelected
                ? "text-dark dark:text-white"
                : "text-dark-6"
            }`}
          >
            {!defaultValue && (
              <option value="" disabled className="text-dark-6">
                Selecione uma opção
              </option>
            )}
            {options.map((option, index) => {
              const optionValue = getOptionValue
                ? getOptionValue(option)
                : (option as unknown as string);
              const optionLabel = getOptionLabel
                ? getOptionLabel(option)
                : (option as unknown as string);

              return (
                <option
                  key={index}
                  value={optionValue}
                  className="text-dark"
                >
                  {optionLabel}
                </option>
              );
            })}
          </select>

          <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
            <Image src={"/images/icon/icon-arrow-down.svg"} width={18} height={18} alt="seta para baixo" />
          </span>
        </div>
    </div>
  );
};

export default SelectGroup;
