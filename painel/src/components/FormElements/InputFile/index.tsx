import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputFileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  customClasses?: string;
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
}

const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  ({ customClasses, label, required, icon, error, ...inputProps }, ref) => {
    return (
      <div className={customClasses}>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
          {required && <span className="text-red">*</span>}
        </label>

        <input
          ref={ref}
          className={`w-full cursor-pointer rounded-[7px] border-[1.5px] ${
            error ? "border-red-500" : "border-stroke dark:border-dark-3"
          } bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-[#E2E8F0] file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-dark-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary`}
          {...inputProps}
          type="file"
        />

        {error && <small className="mt-1 block text-sm text-red-500">{error}</small>}
      </div>
    );
  }
);

InputFile.displayName = "InputFile";

export default InputFile;
