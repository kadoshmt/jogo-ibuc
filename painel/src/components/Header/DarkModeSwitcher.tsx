import useColorMode from "@/hooks/useColorMode";
import Image from "next/image";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <li>
      <div
        onClick={() => {
          if (typeof setColorMode === "function") {
            setColorMode(colorMode === "light" ? "dark" : "light");
          }
        }}
        className={`relative z-10 flex h-12 w-[96px] cursor-pointer items-center gap-2.5 rounded-full bg-gray-3 p-[5px] text-dark dark:bg-[#020d1a] dark:text-white`}
      >
        <div
          className={`absolute left-0.5 top-1/2 z-1 h-9.5 w-9.5 -translate-y-1/2 rounded-full bg-white transition-transform duration-300 ease-in-out dark:bg-dark-3 ${colorMode === "dark" ? "translate-x-[51px]" : "translate-x-[3px]"}`}
        />

        <span className="relative z-10 flex h-9.5 w-full max-w-9.5 items-center justify-center">
          <Image src={"/images/icon/icon-sun.svg"} width={20} height={20} alt="Modo Claro" />
        </span>
        <span className="relative z-10 flex h-9.5 w-full max-w-9.5 items-center justify-center">
          <Image src={"/images/icon/icon-moon.svg"} width={20} height={20} alt="Modo Escuro" />
        </span>
      </div>
    </li>
  );
};

export default DarkModeSwitcher;
