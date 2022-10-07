import React from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import services from "services";

export default function Footer(props) {
  return (
    <footer className=" w-full flex justify-center px-2 py-4 bg-[#0813ff] text-white sm:px-4 shadow-xl dark:bg-[#2c2e3f] dark:border-gray-700 z-10">
      {/* Bottom area */}
      <div className="flex flex-row justify-between md:flex md:flex-row md:items-center md:justify-between py-1 border-t border-blue-400 dark:border-gray-500 w-screen max-w-6xl">
        {/* Copyrights note */}
        <div className="flex text-sm text-white mr-4">
          <div className="m-auto">
            Fantom Explorer <span>&#169;</span>
            {"   " + new Date().getFullYear()} - Developed by Fantom Foundation
          </div>
        </div>
        {/* Copyrights note */}
        <div className="flex flex-row items-center text-sm text-gray-600 gap-4">
          <a
            className="py-2 cursor-pointer"
            href="mailto:jonathan.cryptoguru@gmail.com"
          >
            <img
              src={services.linking.static("images/telegram.svg")}
              alt="mail"
              srcSet=""
              className="w-6"
            />
          </a>
          <a
            className="py-2 cursor-pointer"
            href="mailto:jonathan.cryptoguru@gmail.com"
          >
            <img
              src={services.linking.static("images/email.svg")}
              alt="mail"
              srcSet=""
              className="w-6"
            />
          </a>
          <div
            className="py-2 cursor-pointer"
            onClick={() => props.handleDarkMode(!props.isDarkmode)}
          >
            {props.isDarkmode
              ? <SunIcon className="w-6" />
              : <MoonIcon className="w-6" />}
          </div>
        </div>
      </div>
    </footer>
  );
}
