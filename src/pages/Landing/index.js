import React from "react";
import components from "components";
import BlockInfo from "./BlockInfo";
import LatestBlocks from "./LatestBlocks";
import LatestTransactions from "./LatestTransactions";
export default function Landing() {
  const handleChange = keyword => {
    const type = getTypeByStr(keyword);
    console.log(type);
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
    <div className=" flex flex-col md:w-8/12 sm:w-8/12 w-10/12">
      <div className="flex justify-center mt-[50px]">
        <div className="relative w-2/4">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <components.Input
            type="text"
            id="voice-search"
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 block pl-10 p-4  rounded-full"
            placeholder="Search by Address / Tx Hash / Block / Name"
            handleChange={handleChange}
            required={false}
          />
        </div>
      </div>

      <BlockInfo />
      <div className="grid md:grid-cols-2 sm:grid-cols-2 gap-4 md:p-4 sm:p-0 p-0  mt-[70px]">
        <LatestBlocks />
        <LatestTransactions />
      </div>
    </div>
  );
}
