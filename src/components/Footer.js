import React from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import services from "services";

export default function Footer(props) {
  return (
    <footer
      className=" w-full px-2 py-4 bg-gray-200 text-white sm:px-4 shadow-xl dark:bg-blue-900 dark:border-gray-700 z-10"
      style={{
        backgroundImage: `url(${services.linking.static(
          "images/abstract-shapes-20.svg"
        )})`
      }}
    >
      {/* Bottom area */}
      <div className="flex flex-row justify-between md:flex md:flex-row md:items-center md:justify-between py-1 border-t border-gray-900 dark:border-gray-200">
        {/* Copyrights note */}
        <div className="flex text-sm text-gray-600 mr-4">
          <div className="m-auto">
            <a href="https://fantom.foundation">
              <img
                src={services.linking.static("images/fantom-ftm-logo.png")}
                alt="Powered by Fantom."
                className="inline-block object-scale-down w-10 h-10 m-2"
              />
              <span className="text-lg md:text-lg dark:text-white text-black">
                Powered by Fantom
              </span>
            </a>
          </div>
        </div>
        {/* Copyrights note */}
        <div className="flex text-sm dark:text-gray-300 text-black mr-4">
          <div className="m-auto">
            Copyright <span>&#169;</span>
            {"   " + new Date().getFullYear()}
          </div>
        </div>
        <div className="flex text-sm text-gray-600 mr-4">
          <div
            className="py-4 px-4 cursor-pointer"
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
