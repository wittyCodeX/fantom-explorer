import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  formatHash,
  isObjectEmpty,
  numToFixed,
  WEIToFTM,
  formatNumberByLocale,
} from "utils";
import components from "components";

const GET_ERC20TOKENLIST = gql`
  query ERC20TokenList {
    erc20TokenList {
      address
      name
      symbol
      decimals
      totalSupply
      logoURL
    }
  }
`;
export default function ERC20TokenList() {
  const [tokenList, setTokenList] = useState([]);
  const { loading, error, data } = useQuery(GET_ERC20TOKENLIST);
  useEffect(async () => {
    if (data) {
      setTokenList(data.erc20TokenList);
    }
  });
  const columns = ["Asset", "Name", "Hash", "Total Supply"];

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
        <img src={item.logoURL} alt="logo" srcSet="" className="w-10 h-10" />
        <span>{" "}</span>
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
        {formatNumberByLocale(numToFixed(WEIToFTM(item.totalSupply), 2))}
      </td>
    </tr>
  );
};
