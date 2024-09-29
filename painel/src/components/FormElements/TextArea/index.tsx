import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
  customClasses?: string;
  label?: string;
  required?: boolean;
  //onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const TextArea: React.FC<TextAreaProps> = ({
  customClasses,
  label,
  required,
  //onChange,
  ...inputProps
}) => {
  return (
    <>
      <div className={customClasses}>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
          {required && <span className="text-red">*</span>}
        </label>


        <textarea
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          {...inputProps}
        ></textarea>

      </div>
    </>
  );
};

export default TextArea;
