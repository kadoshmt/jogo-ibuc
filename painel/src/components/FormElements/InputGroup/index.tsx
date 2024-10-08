import React, { InputHTMLAttributes } from "react";

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  customClasses?: string;
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
}

// Utiliza forwardRef para encaminhar a ref para o input
const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  ({ customClasses, label, required, icon, error, ...inputProps }, ref) => {
    return (
      <div className={customClasses}>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
          {required && <span className="text-red">*</span>}
        </label>
        {icon ? (
          <div className="relative">
            <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
              {icon}
            </span>
            <input
              ref={ref}
              className={`w-full rounded-[7px] border-[1.5px] ${
                error ? "border-red-500" : "border-stroke dark:border-dark-3"
              } bg-white dark:bg-dark-2 py-2.5 pl-12.5 pr-4.5 text-dark dark:text-white outline-none focus-visible:outline-none transition placeholder:text-dark-6 active:border-primary focus:border-primary dark:focus:border-primary disabled:cursor-default disabled:bg-gray-2 dark:disabled:bg-dark`}
              {...inputProps}
            />
          </div>
        ) : (
          <input
            ref={ref}
            className={`w-full rounded-[7px] border-[1.5px] ${
              error ? "border-red-500" : "border-stroke dark:border-dark-3"
            } bg-white dark:bg-dark-2 px-4.5 py-2.5 text-dark dark:text-white outline-none focus-visible:outline-none transition placeholder:text-dark-6 active:border-primary focus:border-primary dark:focus:border-primary disabled:cursor-default disabled:bg-gray-2 dark:disabled:bg-dark`}
            {...inputProps}
          />
        )}
        {error && <small className="mt-1 block text-sm text-red-500">{error}</small>}
      </div>
    );
  }
);

InputGroup.displayName = "InputGroup";

export default InputGroup;
