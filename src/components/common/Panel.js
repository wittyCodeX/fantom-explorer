import React from "react";
import { Link } from "react-router-dom";

const Panel = props => {
  return (
    <div
      className={`relative mb-2 bg-white text-black dark:text-gray-300 dark:bg-blue-800 border-solid border-grey-light dark:border-blue-right rounded shadow-sm `}
    >
      <div className="bg-grey-lighter text-xl px-2 py-3 border-solid border-grey-light  dark:border-blue-right  border-b">
        {props.title}
      </div>
      <div
        className={`p-3  overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200  overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full ${props.classes
          ? props.classes
          : ""}`}
      >
        {props.children}
      </div>
      {props.btnLabel &&
        <div className="absolute bottom-0 bg-white dark:text-gray-300 dark:bg-blue-800 text-xl w-full py-1 flex justify-center border-solid border-grey-light  dark:border-blue-right border-t">
          <Link
            className="bg-transparent text-center hover:bg-blue-500 w-11/12 text-blue-700 dark:text-gray-300 font-semibold hover:text-white py-2 border border-blue-500 hover:border-transparent rounded-full text-sm"
            to={props.to}
          >
            {props.btnLabel}
          </Link>
        </div>}
    </div>
  );
};

export default Panel;
