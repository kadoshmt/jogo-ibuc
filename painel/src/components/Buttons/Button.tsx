import React, { ButtonHTMLAttributes, useEffect, useState } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText: string;
  customClasses?: string;
  color?: "primary" | "white" | "red" | "orange" | "blue" | "yellow" | "green"
  isLoading?: boolean;
}

interface Colors {
  textColor: string;
  textDarkColor?: string;
  bgColor: string;
  bgDarkColor?: string;
}


const Button : React.FC<ButtonProps> = ({
  buttonText,
  customClasses,
  isLoading = false,
  color = "primary",
  ...buttonProps

}: ButtonProps) => {
  const [colors, setColors] = useState<Colors>({textColor: 'text-gray-2', bgColor: 'bg-primary'});

  useEffect(() => {
    switch (color) {
      case "primary":
        setColors({
          textColor: 'text-gray-2',
          bgColor: 'bg-primary'
        });
        break;

      case "white":
        setColors({
          textColor: 'text-dark',
          textDarkColor: 'dark:text-white',
          bgColor: '',
        });
        break;
      case "red":
        setColors({
          textColor: 'text-gray-2',
          bgColor: 'bg-red'
        });
        break;
      case "blue":
        setColors({
          textColor: 'text-gray-2',
          bgColor: 'bg-blue'
        });
        break;
      case "orange":
        setColors({
          textColor: 'text-gray-2',
          bgColor: 'bg-orange-400'
        });
        break;
      case "yellow":
        setColors({
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-300'
        });
        break;
      case "green":
        setColors({
          textColor: 'text-gray-2',
          bgColor: 'bg-green'
        });
        break;

      default:
        setColors({
          textColor: 'text-gray-2',
          bgColor: 'bg-primary'
        });
        break;
    }
  }, [color]);



  return (
    <>
      <button
        className={`flex items-center  justify-center  rounded-[7px] px-6 py-[7px] font-medium ${colors.textColor} ${colors.bgColor} ${colors.textDarkColor} ${colors.bgDarkColor}
        ${isLoading ? 'cursor-not-allowed bg-opacity-70 hover:bg-opacity-70' : ''}
        ${color === 'white' ? 'border border-stroke hover:shadow-1 dark:border-dark-3' : 'hover:bg-opacity-90'}
        ${customClasses}
          `
        }
        onClick={() => {
          document.getElementById("profilePhoto")?.click();
        }}
        disabled={isLoading}
        {...buttonProps}
      >
        {isLoading && (<span className={`h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid ${color === 'white' ? 'border-dark-5 ' : 'border-white'} border-t-transparent`}></span>)}
        {buttonText}
      </button>
    </>
  );
};

export default Button;
