import React from "react";
import BlockInfo from "./BlockInfo";
import LatestBlocks from "./LatestBlocks";
import LatestTransactions from "./LatestTransactions";
export default function Landing() {
  return (
    <div className=" flex flex-col max-w-6xl w-screen p-2">
      <BlockInfo />
      <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-4 sm:p-4 p-4]">
        <LatestBlocks classes="grid" />
        <LatestTransactions classes="grid" />
      </div>
    </div>
  );
}
