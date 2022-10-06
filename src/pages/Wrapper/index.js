import React, { useEffect, useState } from "react";
import components from "components";
import { setDOMDarkmode, getTypeByStr } from "utils";
import { writeStorage, useLocalStorage } from "@rehooks/local-storage";

const Wrapper = (props) => {
  const [darkMode] = useLocalStorage("darkMode");
  const [isDarkmode, setDarkMode] = React.useState(darkMode);
  const [keywordType, setKeywordType] = useState("all");
  const [keyword, setKeyword] = useState("");

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
  const handleChange = (_keyword) => {
    const type = getTypeByStr(_keyword);
    console.log(type);
    switch (type) {
      case "transaction_hash":
        location.href = "/transactions/" + _keyword;
        break;
      case "address":
        location.href = "/address/" + _keyword;
        break;
      case "block":
        location.href = "/blocks/" + _keyword;
        break;
      case "domain":
        location.href = "/domain/" + _keyword;
        break;
      default:
        break;
    }
  };
  const onClickSearch = () => {
    const type = getTypeByStr(keyword);
    switch (type) {
      case "transaction_hash":
        location.href = "/transactions/" + keyword;
        break;
      case "address":
        location.href = "/address/" + keyword;
        break;
      case "block":
        location.href = "/blocks/" + keyword;
        break;
      case "domain":
        location.href = "/domain/" + keyword;
        break;
      default:
        break;
    }
  };
  return (
    <>
      <components.Navbar
        handleDarkMode={handleDarkMode}
        isDarkmode={isDarkmode}
      />
      <div className="min-h-screen flex flex-col items-center m-auto text-white dark:text-gray-300  bg-gray-200  dark:bg-gradient-to-r from-[#222431] via-[#252431] to-[#222431] w-full p-2">
        {window.location.pathname !== "/" && (
          <div className="hidden md:flex flex items-center justify-center mx-auto w-full max-w-6xl mt-2">
            <div className="flex w-full">
              <div className="flex-none bg-gray-100 dark:bg-[#2c2e3f] p-0.5 rounded-l border  border-gray-300">
                <select
                  id="countries"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#2c2e3f] dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setKeywordType(e.target.value)}
                  value={keywordType}
                >
                  <option value="all">All</option>
                  <option value="block">Block</option>
                  <option value="txhash">Tx Hash</option>
                  <option value="address">Address</option>
                  <option value="token">Token</option>
                  <option value="domain">Domain</option>
                </select>
              </div>
              <components.Input
                type="text"
                id="voice-search"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-gray-500 focus:border-gray-500 block pl-2 p-3"
                placeholder="Search by Address / Tx Hash / Block / Name"
                handleChange={handleChange}
                value={keyword}
                onInputChange={(e) => setKeyword(e.target.value)}
                required={false}
              />
              <button
                className="bg-[#0713ff] dark:bg-[#2c2e3f] text-gray-100 hover:bg-gray-800 px-5 md:text-lg sm:text-md text-black dark:text-gray-100 rounded-r hidden sm:hidden md:hidden lg:block border  border-gray-300"
                onClick={onClickSearch}
              >
                Search
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-center p-2">
        {props.children}
        </div>
      </div>
      <components.Footer
        handleDarkMode={handleDarkMode}
        isDarkmode={isDarkmode}
      />
    </>
  );
};

export default Wrapper;
