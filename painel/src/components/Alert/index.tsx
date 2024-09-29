import Image from "next/image";
import React from "react";

interface AlertProps {
  type: 'success' | 'error' | 'warning';
  title: string;
  message?: string;
  messageList?: string[];
}

const Alert : React.FC<AlertProps> = ({title, message, type}) => {
  return (
    <>
      { type === 'success' && (
        <div className="flex w-full rounded-[10px] border-l-6 border-green bg-green-light-7 px-7 py-8 dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
        <div className="mr-5.5 mt-[5px] flex h-8 w-full max-w-8 items-center justify-center rounded-md bg-green">
        <Image src={"/images/icon/icon-success.svg"} width={16} height={12} alt="ícone sucesso" />
        </div>
        <div className="w-full">
          <h5 className="mb-2 font-bold leading-[22px] text-[#004434] dark:text-[#34D399]">
            {title}
          </h5>
          <p className={`text-[#637381]`}> {message} </p>
        </div>
      </div>
      )}

      { type === 'warning' && (
        <div className="flex w-full rounded-[10px] border-l-6 border-[#FFB800] bg-[#FEF5DE] px-7 py-8 dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
        <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FBBF24]">
        <Image src={"/images/icon/icon-warning.svg"} width={16} height={12} alt="ícone alerta" />
        </div>
        <div className="w-full">
        <h5 className="mb-3.5 text-lg font-bold leading-[22px] text-[#9D5425]">
            {title}
          </h5>
          <p className="w-full max-w-[740px] text-[#D0915C]"> {message} </p>
        </div>
      </div>
      )}

      { type === 'error' && (
        <div className="flex w-full rounded-[10px] border-l-6 border-red-light bg-red-light-5 px-7 py-8 dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
          <div className="mr-5 mt-[5px] flex h-8 w-full max-w-8 items-center justify-center rounded-md bg-red-light">
            <Image src={"/images/icon/icon-error.svg"} width={16} height={12} alt="ícone alerta" />
          </div>
          <div className="w-full">
          <h5 className="mb-4 font-bold leading-[22px] text-[#BC1C21]">
            {title}
          </h5>
          <p className="text-[#CD5D5D]"> {message} </p>
        </div>
      </div>
      )}
    </>
  );
};

export default Alert;
