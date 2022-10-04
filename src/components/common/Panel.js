import React from "react";
import { Link } from "react-router-dom";

const Panel = props => {
  return (
    <div
      className={`relative mb-2 bg-gray-100 text-black dark:text-gray-300 dark:bg-[#2c2e3f] `}
    >
      <div className="flex flex-row items-center justify-between bg-gray-200 dark:bg-[#222431] text-xl px-2 py-3">
        <div className="flex flex-row items-center justify-between">
          {props.icon &&
            <img src={props.icon} alt="" srcSet="" className="w-5 h-5 m-2" />}
          <span className="text-sm font-semibold">
            {props.title}
          </span>
        </div>
        {props.btnLabel &&
          <Link
            className="flex-none bg-transparent hover:bg-blue-100 dark:hover:bg-gray-700 text-center text-blue-700 dark:text-gray-300 font-semibold px-3 py-1 border border-blue-500 dark:border-gray-500 rounded text-sm"
            to={props.to}
          >
            {props.btnLabel}
          </Link>}
      </div>

      <div
        className={`p-3  overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-[#2c2e4f]  scrollbar-track-gray-200 dark:scrollbar-track-[#2c2e3f] overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full border-solid border-grey-light dark:border-blue-right shadow-md  ${props.classes
          ? props.classes
          : ""}`}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Panel;
