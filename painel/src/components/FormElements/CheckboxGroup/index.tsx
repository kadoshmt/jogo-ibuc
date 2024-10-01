import React from 'react';

interface CheckboxGroupProps<T, V> {
  options: T[];
  value: V[];
  onChange: (selectedValues: V[]) => void;
  layout?: 'inline' | 'block';
  label?: string;
  required?: boolean;
  disabled?: boolean | V[];
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => V;
  customClasses?: string;
  error?: string;
}

const CheckboxGroup = <T, V>({
  options,
  value,
  onChange,
  layout = 'inline',
  label,
  required,
  disabled = false,
  getOptionLabel,
  getOptionValue,
  customClasses,
  error,
}: CheckboxGroupProps<T, V>) => {
  const getOptionValueFn = getOptionValue ?? ((option: T) => option as unknown as V);
  const getOptionLabelFn = getOptionLabel ?? ((option: T) => String(option));

  const handleChange = (optionValue: V) => {
    let newValues: V[];
    if (value.includes(optionValue)) {
      newValues = value.filter((v) => v !== optionValue);
    } else {
      newValues = [...value, optionValue];
    }
    onChange(newValues);
  };

  const isOptionDisabled = (optionValue: V): boolean => {
    if (typeof disabled === 'boolean') {
      return disabled;
    }
    return (disabled as V[]).includes(optionValue);
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
          const isChecked = value.includes(optionValue);
          const isDisabled = isOptionDisabled(optionValue);
          const inputId = `checkbox-${String(optionValue)}-${index}`;

          return (
            <label
              key={index}
              htmlFor={inputId}
              className={`flex items-center cursor-pointer select-none mr-4 text-dark dark:text-white ${
                layout === 'block' ? 'mb-2' : 'mb-0'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="checkbox"
                id={inputId}
                name={inputId}
                className="sr-only"
                checked={isChecked}
                onChange={() => handleChange(optionValue)}
                disabled={isDisabled}
              />
              <div
                className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                  isChecked
                    ? 'border-primary bg-gray-2 dark:bg-transparent'
                    : 'border-dark-5 dark:border-dark-6'
                } ${isDisabled ? 'bg-gray-200' : ''}`}
              >
                {isChecked && (
                  <span className="h-2.5 w-2.5 rounded-sm bg-primary"></span>
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

export default CheckboxGroup;
