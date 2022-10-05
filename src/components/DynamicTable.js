import React from "react";

const DynamicTable = props => {
  return (
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
  );
};

export default DynamicTable;
