// RadioGroup.tsx
import React from 'react';

interface RadioGroupProps<T, V> {
  options: T[];
  value: V;
  onChange: (selectedValue: V) => void;
  name: string;
  layout?: 'inline' | 'block';
  label?: string;
  required?: boolean;
  disabled?: boolean | V[];
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => V;
  customClasses?: string;
  error?: string;
}

const RadioGroup = <T, V>({
  options,
  value,
  onChange,
  name,
  layout = 'inline',
  label,
  required,
  disabled = false,
  getOptionLabel,
  getOptionValue,
  customClasses,
  error,
}: RadioGroupProps<T, V>) => {
  const getOptionValueFn = getOptionValue ?? ((option: T) => option as unknown as V);
  const getOptionLabelFn = getOptionLabel ?? ((option: T) => String(option));

  const isOptionDisabled = (optionValue: V): boolean => {
    if (typeof disabled === 'boolean') {
      return disabled;
    }
    return (disabled as V[]).includes(optionValue);
  };

  const handleChange = (optionValue: V) => {
    onChange(optionValue);
  };

  return (
    <div className={customClasses}>
      {label && (
        <label className="block text-body-sm font-medium text-dark dark:text-white mb-2">
          {label}
          {required && <span className="text-red">*</span>}
        </label>
      )}
      <div className={`flex ${layout === 'block' ? 'flex-col' : 'flex-row flex-wrap'}`}>
        {options.map((option, index) => {
          const optionValue = getOptionValueFn(option);
          const optionLabel = getOptionLabelFn(option);
          const isChecked = value === optionValue;
          const isDisabled = isOptionDisabled(optionValue);
          const inputId = `radio-${name}-${String(optionValue)}-${index}`;

          return (
            <label
              key={index}
              htmlFor={inputId}
              className={`flex items-center cursor-pointer select-none mr-4 ${
                layout === 'block' ? 'mb-2' : 'mb-0'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                className="sr-only"
                checked={isChecked}
                onChange={() => handleChange(optionValue)}
                disabled={isDisabled}
              />
              <div
                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border ${
                  isChecked
                    ? 'border-primary bg-gray-2 dark:bg-transparent'
                    : 'border-dark-5 dark:border-dark-6'
                } ${isDisabled ? 'bg-gray-200' : ''}`}
              >
                {isChecked && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                )}
              </div>
              {optionLabel}
            </label>
          );
        })}
      </div>
      {error && <small className="mt-1 block text-sm text-red-500">{error}</small>}
    </div>
  );
};

export default RadioGroup;
