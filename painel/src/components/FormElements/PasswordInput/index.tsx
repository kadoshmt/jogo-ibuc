import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import React, { InputHTMLAttributes, useState } from "react";

interface PasswordInputGroupProps  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  customClasses?: string;
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
}

// Utiliza forwardRef para encaminhar a ref para o input
const PasswordInputGroup = React.forwardRef<HTMLInputElement, PasswordInputGroupProps>(
  ({ customClasses, label, required, icon, error, ...inputProps }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className={customClasses}>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
          {required && <span className="text-red">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
              {icon}
            </span>
          )}
          <button className="absolute inset-0 left-auto right-5 flex items-center" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeIcon className="size-5" /> : <EyeSlashIcon className="size-5" />}
          </button>
          <input
            ref={ref}
            className={`w-full rounded-[7px] border-[1.5px] ${
              error ? "border-red-500" : "border-stroke dark:border-dark-3"
            } bg-white dark:bg-dark-2 py-2.5 pl-12.5 pr-4.5 text-dark dark:text-white outline-none focus-visible:outline-none transition placeholder:text-dark-6 active:border-primary focus:border-primary dark:focus:border-primary disabled:cursor-default disabled:bg-gray-2 dark:disabled:bg-dark`}
            type={showPassword ? "text" : "password"}
            {...inputProps}
          />
        </div>
        {error && <small className="mt-1 block text-sm text-red-500">{error}</small>}
      </div>
    );
  }
);

PasswordInputGroup.displayName = "PasswordInputGroup";

export default PasswordInputGroup;
