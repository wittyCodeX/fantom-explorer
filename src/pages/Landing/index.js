import React from 'react'
import components from 'components'
import BlockInfo from './BlockInfo'
import LatestBlocks from './LatestBlocks'
import LatestTransactions from './LatestTransactions'
export default function Landing() {
  return (
    <div className=" flex flex-col md:w-9/12 sm:w-9/12 w-11/12">
      <div className="flex flex-col justify-center">
        <h2 className="text-5xl md:text-4xl mt-[70px] text-center">
          Fantom Domain Explorer
        </h2>
        <form className="flex  justify-center items-center my-7 max-w-screen max-w-">
          <div className="relative md:w-2/6">
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
                ></path>
              </svg>
            </div>
            <components.Input
              type="text"
              id="voice-search"
              className="bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by Address / Tx Hash / Block / Name"
              required={false}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-3 text-sm font-medium text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </form>
      </div>
      <BlockInfo />
      <div className="grid md:grid-cols-2 sm:grid-cols-2 gap-4 p-4 sm:p-0  mt-[50px]">
        <LatestBlocks />
        <LatestTransactions />
      </div>
    </div>
  )
}
