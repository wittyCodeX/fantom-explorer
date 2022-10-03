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
  console.log("darkMode", darkMode);
  useEffect(() => {
    setDOMDarkmode(darkMode);
    setDarkMode(darkMode);
  }, []);
  return (
    <>
      <components.Navbar
        handleDarkMode={handleDarkMode}
        isDarkmode={isDarkmode}
      />
      <div
        className="min-h-screen text-white dark:text-gray-300  bg-gray-200 dark:bg-blue-900 w-full flex justify-center"
        style={{
          backgroundImage: `url(${
            isDarkmode
              ? services.linking.static("images/abstract-shapes-20.svg")
              : ""
          })`,
        }}
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
