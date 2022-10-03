import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  formatHash,
  isObjectEmpty,
  numToFixed,
  WEIToFTM,
  formatNumberByLocale,
  fromTokenValue,
  getTokenDecimals,
} from "utils";
import components from "components";

const GET_ASSETS = gql`
  query DefiTokens {
    defiTokens {
      address
      name
      symbol
      logoUrl
      decimals
      price
      priceDecimals
      totalSupply
      isActive
      canWrapFTM
      canDeposit
      canMint
      canBorrow
      canTrade
    }
  }
`;
export default function FantomAssets() {
  const [tokenList, setTokenList] = useState([]);
  const { loading, error, data } = useQuery(GET_ASSETS);
  useEffect(async () => {
    if (data) {
      const tokens = data.defiTokens.filter(
        (_item) => _item.isActive && _item.symbol !== "FTM"
      );
      setTokenList(tokens);
    }
  });
  const columns = [
    "Asset",
    "Name",
    "Hash",
    "Price",
    "Total Supply",
    "Market Cap",
  ];

  return (
    <components.DynamicTable columns={columns}>
      {isObjectEmpty(tokenList) ? (
        <tr>
          <td colSpan={columns?.length}>
            <components.Loading />
          </td>
        </tr>
      ) : (
        tokenList &&
        tokenList.map((item, index) => (
          <DynamicTableRow item={item} key={index} />
        ))
      )}
    </components.DynamicTable>
  );
}
const DynamicTableRow = ({ item }) => {
  return (
    <tr>
      <td className="px-2 text-sm flex flex-row items-center  py-3">
        <img src={item.logoUrl} alt="logo" srcSet="" className="w-10 h-10" />
        <span> </span>
        <span> {item.symbol}</span>
      </td>
      <td className="px-2 text-sm truncate   py-3">{item.name}</td>
      <td className="px-2 text-sm truncate   py-3">
        <Link className="text-blue-500 dark:text-gray-300" to={`/assets/${item.address}`}>
          {" "}
          {formatHash(item.address)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        ${" "}
        {formatNumberByLocale(
          fromTokenValue(item.price, item),
          getTokenDecimals(item, 2) + 1
        )}
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {formatNumberByLocale(
          fromTokenValue(item.totalSupply, item).toFixed(0),
          0
        )}
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {`$ ${formatNumberByLocale((fromTokenValue(item.totalSupply, item) * fromTokenValue(item.price, item)).toFixed(0), 0)}`}
      </td>
    </tr>
  );
};
