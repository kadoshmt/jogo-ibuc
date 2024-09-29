import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectProps<T, V> {
  options: T[];
  value?: V[];
  onChange?: (selectedValues: V[]) => void;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => V;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  customClasses?: string;
}

const MultiSelect = <T, V>({
  options,
  value = [],
  onChange,
  getOptionLabel,
  getOptionValue,
  label,
  placeholder = 'Selecione uma opção',
  disabled = false,
  customClasses,
}: MultiSelectProps<T, V>) => {
  const [selectedValues, setSelectedValues] = useState<V[]>(value);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getOptionValueFn = getOptionValue ?? ((option: T) => option as unknown as V);
  const getOptionLabelFn = getOptionLabel ?? ((option: T) => String(option));

  const handleOptionClick = (option: T) => {
    const optionValue = getOptionValueFn(option);
    let newSelectedValues: V[];
    if (selectedValues.includes(optionValue)) {
      newSelectedValues = selectedValues.filter((v) => v !== optionValue);
    } else {
      newSelectedValues = [...selectedValues, optionValue];
    }
    setSelectedValues(newSelectedValues);
    if (onChange) {
      onChange(newSelectedValues);
    }
  };

  const removeSelectedValue = (optionValue: V) => {
    const newSelectedValues = selectedValues.filter((v) => v !== optionValue);
    setSelectedValues(newSelectedValues);
    if (onChange) {
      onChange(newSelectedValues);
    }
  };

  // Fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Sincronizar o estado interno com a prop 'value' se for um componente controlado
  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  return (
    <div className={`relative ${customClasses}`} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
      {label && (
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
        </label>
      )}
      <div>
        {/* Select oculto */}
        <select className="hidden">
          {options.map((option, index) => {
            const optionValue = getOptionValueFn(option);
            const optionLabel = getOptionLabelFn(option);
            return (
              <option key={index} value={String(optionValue)}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        <div className="flex flex-col items-center">
          <input
            name="values"
            type="hidden"
            value={selectedValues.map(String).join(',')}
          />
          <div className="relative inline-block w-full">
            <div className="relative flex flex-col items-center">
              <div
                ref={triggerRef}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className="w-full"
              >
                <div
                  className={`mb-2 flex rounded-[7px] border-[1.5px] border-stroke py-[9px] pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 ${
                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex flex-auto flex-wrap gap-3">
                    {selectedValues.length > 0 ? (
                      selectedValues.map((selectedValue, index) => {
                        const option = options.find(
                          (opt) => getOptionValueFn(opt) === selectedValue
                        );
                        if (!option) return null;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-center rounded-[5px] border-[.5px] border-stroke bg-gray-2 px-2.5 py-[3px] text-body-sm font-medium dark:border-dark-3 dark:bg-dark"
                          >
                            <div className="max-w-full flex-initial">
                              {getOptionLabelFn(option)}
                            </div>
                            {!disabled && (
                              <div className="flex flex-auto flex-row-reverse">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSelectedValue(selectedValue);
                                  }}
                                  className="cursor-pointer pl-1 hover:text-red"
                                >
                                  {/* Ícone de fechar */}
                                  <svg
                                    className="fill-current"
                                    role="button"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                      fill=""
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1">
                        <input
                          placeholder={placeholder}
                          className="h-full w-full appearance-none bg-transparent p-1 px-2 text-dark-5 outline-none dark:text-dark-6"
                          value=""
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center py-1 pl-1 pr-1">
                    <button
                      type="button"
                      onClick={() => !disabled && setIsOpen(!isOpen)}
                      className="cursor-pointer text-dark-4 outline-none focus:outline-none dark:text-dark-6"
                    >
                      {/* Ícone de seta */}
                      <svg
                        className={`fill-current transform transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.69149 7.09327C3.91613 6.83119 4.31069 6.80084 4.57277 7.02548L9.99936 11.6768L15.4259 7.02548C15.688 6.80084 16.0826 6.83119 16.3072 7.09327C16.5319 7.35535 16.5015 7.74991 16.2394 7.97455L10.4061 12.9745C10.172 13.1752 9.82667 13.1752 9.59261 12.9745L3.75928 7.97455C3.4972 7.74991 3.46685 7.35535 3.69149 7.09327Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              {isOpen && (
                <div
                  className="absolute left-0 top-full w-full max-h-40 overflow-y-auto rounded bg-white shadow-1 dark:bg-dark-2 dark:shadow-card"
                  style={{ zIndex: 9999 }}
                  ref={dropdownRef}
                >
                  <div className="flex w-full flex-col">
                    {options
                      .filter(
                        (option) => !selectedValues.includes(getOptionValueFn(option))
                      )
                      .map((option, index) => {
                        const optionValue = getOptionValueFn(option);
                        const optionLabel = getOptionLabelFn(option);
                        return (
                          <div key={index}>
                            <div
                              className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-dark-3"
                              onClick={() => handleOptionClick(option)}
                            >
                              <div className="relative flex w-full items-center p-2 pl-2">
                                <div className="flex w-full items-center">
                                  <div className="mx-2 leading-6">{optionLabel}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
