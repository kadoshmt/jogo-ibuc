import React, { HTMLInputTypeAttribute } from "react";

interface InputGroupProps {
  customClasses?: string;
  label?: string;
  type?: HTMLInputTypeAttribute;
  name?: string;
  id?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const InputGroup: React.FC<InputGroupProps> = ({
  customClasses,
  label,
  type,
  name,
  id,
  defaultValue,
  placeholder,
  required,
  icon,
  disabled = false,
  onChange,
}) => {
  return (
    <>
      <div className={customClasses}>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
          {required && <span className="text-red">*</span>}
        </label>
        { icon && (
          <div className="relative">
          <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
            {icon}
          </span>
          <input
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-12.5 pr-4.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            type={type || 'text'}
            name={name}
            id={id}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled = {disabled}
          />
        </div>
        )}
        { !icon && (
        <input
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-4.5 py-2.5 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          type={type || 'text'}
          name={name}
          id={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled = {disabled}
        />
        )}
      </div>
    </>
  );
};

export default InputGroup;
