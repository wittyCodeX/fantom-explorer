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
    <div className=" flex flex-col max-w-6xl w-screen p-2">
      <BlockInfo />
      <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-4 sm:p-4 p-4]">
        <LatestBlocks classes="grid" />
        <LatestTransactions classes="grid" />
      </div>
    </div>
  );
}
