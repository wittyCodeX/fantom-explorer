import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/solid'
import services from 'services'
import components from 'components'
import { numToFixed, getTypeByStr } from 'utils'

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false) // initiate isNavOpen state with false
  const [price, setPrice] = useState(0)
  useEffect(() => {
    const getFTMPrice = async () => {
      const api = services.provider.buildAPI()
      const rate = await api.getFTMConversionRateFromChainlink(
        '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc',
      )
      const ftmPrice = rate / Math.pow(10, 8)
      setPrice(ftmPrice)
    }
    getFTMPrice()
  }, [])

  const handleChange = (keyword) => {
    const type = getTypeByStr(keyword)
    console.log(type)
    switch (type) {
      case 'transaction_hash':
        location.href = '/transactions/' + keyword
        break
      case 'address':
        location.href = '/address/' + keyword
        break
      case 'block':
        location.href = '/blocks/' + keyword
        break
      case 'domain':
        location.href = '/domain/' + keyword
        break
      default:
        break
    }
  }
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
        <div className="relative w-96">
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
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 block pl-10 p-2.5"
            placeholder="Search by Address / Tx Hash / Block / Name"
            handleChange={handleChange}
            required={false}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mx-auto max-w-7xl mt-2">
        <div className="bg-gray-200 py-1 px-2 text-sm">
          FTM: {numToFixed(price, 4)} $
        </div>
        <div className="flex justify-end items-center space-x-1">
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
                to="/epochs"
              >
                <div>Epochs</div>
              </Link>
            </li>
            <li>
              <Link
                className="block text-lg px-3 w-full flex items-center justify-between"
                to="/staking"
              >
                <div>Staking</div>
              </Link>
            </li>
            <li>
              <Link
                className="block text-lg px-3 w-full flex items-center justify-between"
                to="/assets"
              >
                <div>Assets</div>
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
