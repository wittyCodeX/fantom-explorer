import React from "react";
import { numToFixed } from "utils";

export default function Pagination({
  paginationPerPage,
  paginationCurrentPage,
  paginationTotalRows,
  onChangePage
}) {
  return (
    <div
      className={`flex flex-row gap-1 items-center justify-end p-2 border-b`}
    >
      <nav aria-label="Page navigation example">
        <ul className="inline-flex items-center gap-1">
          <li>
            <button
              className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-gray-300 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => onChangePage(paginationCurrentPage - 1)}
              disabled={paginationCurrentPage !== 1 ? "" : "disabled"}
            >
              <span className="sr-only">Previous</span>
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          <li>
            <div className="text-sm p-2 bg-gray-300 dark:bg-gray-500 dark:text-gray-100 rounded-lg">
              Page {paginationCurrentPage} {" of "}{" "}
              {numToFixed(paginationTotalRows / paginationPerPage, 0)}
            </div>
          </li>
          <li>
            <button
              className="block py-2 px-3 leading-tight text-gray-500 bg-gray-300 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => onChangePage(paginationCurrentPage + 1)}
              disabled={
                paginationCurrentPage !==
                numToFixed(paginationTotalRows / paginationPerPage, 0)
                  ? ""
                  : "disabled"
              }
            >
              <span className="sr-only">Next</span>
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
