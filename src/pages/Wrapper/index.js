import React, { useEffect } from "react";
import components from "components";
import services from "services";
import { setDOMDarkmode } from "utils";
import { writeStorage, useLocalStorage } from "@rehooks/local-storage";

const Wrapper = (props) => {
  const [darkMode] = useLocalStorage("darkMode");
  const [isDarkmode, setDarkMode] = React.useState(darkMode);

  const handleDarkMode = (flag) => {
    writeStorage("darkMode", flag);
    setDOMDarkmode(flag);
    setDarkMode(flag);
  };
  useEffect(() => {
    setDOMDarkmode(darkMode);
    setDarkMode(darkMode); 
  }, []);
  // dark:bg-[#202020] #222431
  
  return (
    <>
      <components.Navbar
        handleDarkMode={handleDarkMode}
        isDarkmode={isDarkmode}
      />
      <div
        className="min-h-screen text-white dark:text-gray-300  bg-gray-200  dark:bg-gradient-to-r from-[#222431] via-[#252431] to-[#222431] w-full flex justify-center"
      >
        {props.children}
      </div>
      <components.Footer
        handleDarkMode={handleDarkMode}
        isDarkmode={isDarkmode}
      />
    </>
  );
};

export default Wrapper;
