import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/solid'
import services from 'services'
export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false) // initiate isNavOpen state with false

  return (
    <header className="sticky top-0 z-30 w-full px-2 py-4 bg-white sm:px-4 shadow-xl">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <Link to="/">
          <img
            src={services.linking.static('images/logo-ftmscan.svg')}
            className="h-6 md:h-7 m-auto dark:w-8 dark:md:h-6"
            alt="FNS Domains"
          />{' '}
        </Link>
        <div className="flex items-center space-x-1">
          <ul className="hidden space-x-2 md:inline-flex">
            <li>
              <Link
                className="block text-lg px-3 w-full flex items-center justify-between"
                to="/"
              >
                <div>Home</div>
              </Link>
            </li>
            <li>
              <Link
                className="block text-lg px-3 w-full flex items-center justify-between"
                to="/blocks"
              >
                <div>Blocks</div>
              </Link>
            </li>
            <li>
              <Link
                className="block text-lg px-3 w-full flex items-center justify-between"
                to="/transactions"
              >
                <div>Transactions</div>
              </Link>
            </li>
            <li>
              <Link
                className="block text-lg px-3 w-full flex items-center justify-between"
                to="/contracts"
              >
                <div>Contracts</div>
              </Link>
            </li>
          </ul>
          <div className="inline-flex md:hidden">
            <button
              className="flex-none px-2 "
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              {!isNavOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}

              <span className="sr-only">Open Menu</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${
          isNavOpen ? '' : 'hidden'
        } bg-white dark:bg-gray-900 left-0 w-screen z-10 transition-all`}
        style={{
          left: '100%',
          transform: !isNavOpen ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <ul className="flex flex-col items-center justify-between">
          <li className="w-full px-2">
            <Link
              className="block text-lg p-2 w-full flex items-center justify-between"
              to="/"
            >
              <div>Home</div>
              <ArrowRightIcon className="w-6" />
            </Link>
          </li>
          <li className="w-full px-2">
            <Link
              className="block text-lg p-2 w-full flex items-center justify-between"
              to="/"
            >
              <div>Blocks</div>
              <ArrowRightIcon className="w-6" />
            </Link>{' '}
          </li>
          <li className="w-full px-2">
            <Link
              className="block text-lg p-2 w-full flex items-center justify-between"
              to="/"
            >
              <div>Transactions</div>
              <ArrowRightIcon className="w-6" />
            </Link>{' '}
          </li>
          <li className="w-full px-2">
            <Link
              className="block text-lg p-2 w-full flex items-center justify-between"
              to="/"
            >
              <div>Tokens</div>
              <ArrowRightIcon className="w-6" />
            </Link>{' '}
          </li>
        </ul>
      </div>
    </header>
  )
}
