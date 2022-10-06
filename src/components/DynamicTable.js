import React from "react";

const DynamicTable = props => {
  return (
    <div className="flex flex-col py-2">
      {props.title &&
        <div className="flex flex-row justify-between items-baseline bg-gray-100 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
          <div className="text-black dark:text-gray-300 text-md  px-2 font-semibold">
            {props.title}
          </div>
        </div>}
      <table
        className={
          "relative transition w-full mx-auto text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-[#2c2e3f]"
        }
      >
        {props.columns &&
          <thead>
            <tr className="bg-gray-200 dark:bg-[#222431]">
              {props.columns.map((column, index) =>
                <td className="p-3" key={index}>
                  {column}
                </td>
              )}
            </tr>
          </thead>}
        <tbody>
          {props.children}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
