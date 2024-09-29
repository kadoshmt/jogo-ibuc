"use client";

import React, { InputHTMLAttributes, useEffect, useState, useId } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  customClasses?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  customClasses,
  ...rest
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);
  const checkboxId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  // Sincronizar o estado interno com a prop 'checked' se for um componente controlado
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <div className={customClasses}>
      <label
        htmlFor={checkboxId}
        className={`flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="relative">
          <input
            type="checkbox"
            id={checkboxId}
            className="sr-only"
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            {...rest}
          />
          <div
            className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked
                ? "border-primary bg-gray-2 dark:bg-transparent"
                : "border-dark-5 dark:border-dark-6"
            } ${disabled ? "bg-gray-200" : ""}`}
          >
            {isChecked && (
              <span className="h-2.5 w-2.5 rounded-sm bg-primary"></span>
            )}
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
