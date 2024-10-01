import React, { TextareaHTMLAttributes, forwardRef } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  customClasses?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ customClasses, label, required, error, ...inputProps }, ref) => {
    return (
      <div className={customClasses}>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
          {required && <span className="text-red">*</span>}
        </label>

        <textarea
          ref={ref}
          className={`w-full rounded-[7px] border-[1.5px] ${
            error ? "border-red-500" : "border-stroke dark:border-dark-3"
          } bg-white dark:bg-dark-2 px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
          {...inputProps}
        ></textarea>

        {error && <small className="mt-1 block text-sm text-red-500">{error}</small>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
