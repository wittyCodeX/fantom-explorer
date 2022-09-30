import React from 'react'
import components from 'components'
import BlockInfo from './BlockInfo'
import LatestBlocks from './LatestBlocks'
import LatestTransactions from './LatestTransactions'
export default function Landing() {
  return (
    <div className=" flex flex-col md:w-9/12 sm:w-9/12 w-11/12">
      <h2 className="text-5xl md:text-4xl mt-[70px] text-black font-extrabold text-center">
        Fantom Domain Explorer
      </h2>
      <BlockInfo />
      <div className="grid md:grid-cols-2 sm:grid-cols-2 gap-4 md:p-4 sm:p-0 p-0  mt-[50px]">
        <LatestBlocks />
        <LatestTransactions />
      </div>
    </div>
  )
}
