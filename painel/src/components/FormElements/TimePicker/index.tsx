import { InputHTMLAttributes, useEffect } from "react";
import flatpickr from "flatpickr";
import {Portuguese} from 'flatpickr/dist/l10n/pt';
import { ClockIcon } from "@heroicons/react/24/outline";

interface TimePickerProps extends InputHTMLAttributes<HTMLInputElement>{
  customClasses?: string;
  label?: string;
  required?: boolean;
  icon?: boolean;
}

const TimePicker : React.FC<TimePickerProps> = ({
  customClasses,
  label,
  required,
  icon = true,
  ...inputProps
}) => {
  useEffect(() => {
    // Init flatpickr
    flatpickr(".form-datepicker", {
      mode: "single",
      locale: Portuguese,
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true,
      prevArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    });
  }, []);

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
        {required && <span className="text-red">*</span>}
      </label>
      <div className="relative">
        <input
          className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          data-class="flatpickr-right"
          {...inputProps}
        />

        {icon && (
          <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <ClockIcon className="size-5" />
        </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
