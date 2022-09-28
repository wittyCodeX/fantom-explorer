import React from 'react';
import {Link} from "react-router-dom";
import {__} from "../lang/setup";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white   flex items-center justify-center">
            <div className="flex flex-col md:flex-row items-center justify-center px-5 text-white">
                <div className="max-w-md">
                    <div className="text-8xl mb-4 font-dark font-bold text-center">
                        <code>404</code>
                    </div>
                    <p className="text-2xl md:text-3xl font-light leading-normal">
                        {__('Sorry we could not find this page')}
                    </p>
                    <div className={"flex justify-center"}>
                        <Link to="/"
                              className="mt-4 capitalize block px-6 border py-2 bg-gray-800 rounded">
                            {__("home page")}
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NotFound;
