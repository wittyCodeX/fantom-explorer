import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className=" bg-gray-900 text-white   flex items-center justify-center p-3">
      <div className="flex flex-col md:flex-row items-center justify-center px-5 text-white">
        <div className="max-w-6xl">
          <div className="text-8xl mb-4 font-dark font-bold text-center">
            <code>404</code>
          </div>
          <p className="text-2xl md:text-3xl font-light leading-normal">
            {"Sorry we could not find this page"}
          </p>
          <div className={"flex justify-center"}>
            <Link
              to="/"
              className="mt-4 capitalize block px-6 border py-2 bg-gray-800 rounded"
            >
              {"home page"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
