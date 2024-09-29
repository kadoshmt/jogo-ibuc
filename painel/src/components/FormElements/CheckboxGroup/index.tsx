import React, { InputHTMLAttributes } from 'react';

interface CheckboxGroupProps<T, V>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'type' | 'onChange' | 'disabled'
  > {
  options: T[];
  value?: V[];
  onChange?: (selectedValues: V[]) => void;
  layout?: 'inline' | 'block';
  label?: string;
  required?: boolean;
  disabled?: boolean | V[];
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => V;
  customClasses?: string;
}

const CheckboxGroup = <T, V>({
  options,
  value = [],
  onChange,
  layout = 'inline',
  label,
  required,
  disabled = false,
  getOptionLabel,
  getOptionValue,
  customClasses,
  ...rest
}: CheckboxGroupProps<T, V>) => {
  // Função padrão para getOptionValue
  const getOptionValueFn = getOptionValue ?? ((option: T) => option as unknown as V);
  const getOptionLabelFn = getOptionLabel ?? ((option: T) => String(option));

  const [selectedValues, setSelectedValues] = React.useState<V[]>(value);

  const handleChange = (optionValue: V) => {
    let newValues: V[];
    if (selectedValues.includes(optionValue)) {
      newValues = selectedValues.filter((v) => v !== optionValue);
    } else {
      newValues = [...selectedValues, optionValue];
    }
    setSelectedValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };

  const isOptionDisabled = (optionValue: V): boolean => {
    if (typeof disabled === 'boolean') {
      return disabled;
    }
    return (disabled as V[]).includes(optionValue);
  };

  // Sincronizar o estado interno com a prop 'value' se for um componente controlado
  React.useEffect(() => {
    setSelectedValues(value || []);
  }, [value]);

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
          const isChecked = selectedValues.includes(optionValue);
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
              <div className="relative">
                <input
                  type="checkbox"
                  id={inputId}
                  name={inputId}
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => handleChange(optionValue)}
                  disabled={isDisabled}
                  {...rest}
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
              </div>
              {optionLabel}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxGroup;
