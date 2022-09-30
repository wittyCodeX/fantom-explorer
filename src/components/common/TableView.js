import React from 'react'
import { Link } from 'react-router-dom'

const TableView = (props) => {
  return (
    <div>
      <div className="flex flex-row justify-between items-baseline bg-gray-100 text-xl px-2 py-3 border-solid border-grey-light border-b mt-5">
        <div className="text-black md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          {props.title}
        </div>
        {!props.dontNeedSubtitle && (
          <div className="text-black text-sm">
            Home {'>'} {props.title}
          </div>
        )}
      </div>
      <div
        className={`relative mb-2 bg-white text-black border-solid border-grey-light border shadow-sm `}
      >
        <div
          className={`p-3  overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200  overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full ${
            props.classes ? props.classes : ''
          }`}
        >
          {props.children}
        </div>
        {props.btnLabel && (
          <div className="absolute bottom-0 bg-white text-xl px-2 py-1 w-full flex justify-center border-solid border-grey-light border-t">
            <Link
              className="bg-transparent w-full text-center hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full text-sm"
              to={props.to}
            >
              {props.btnLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default TableView
