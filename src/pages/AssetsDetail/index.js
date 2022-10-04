import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import {
  formatHexToInt,
  formatIntToHex,
  timestampToDate,
  numToFixed,
  isObjectEmpty,
  WEIToFTM,
  formatNumberByLocale,
  formatDate,
} from "utils";
import moment from "moment";

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
export default function AssetsDetail() {
  const params = useParams();
  const [token, setToken] = useState([]);
  const { loading, error, data } = useQuery(GET_ERC20TOKENLIST);

  useEffect(() => {
    if (data) {
      const tokenList = data.erc20TokenList;
      const token = tokenList.filter((_item) => _item.address === params.id);
      if (token) {
        setToken(token[0]);
      }
    }
  }, [data]);
  return (
    <div>
      <components.TableView
        classes="w-screen max-w-6xl"
        title={`Assets Detail`}
        dontNeedSubtitle={true}
      >
        <components.DynamicTable>
          {isObjectEmpty(token) ? (
            <tr>
              <td>
                <components.Loading />
              </td>
            </tr>
          ) : (
            <>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Logo:
                  </div>
                  <div className="col-span-2">
                    <img
                      src={token.logoURL}
                      alt="logo"
                      srcSet=""
                      className="w-20 h-20"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Symbol:
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold">{token.symbol}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Name:
                  </div>
                  <div className="col-span-2">{token.name}</div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Contract:
                  </div>
                  <Link
                    className="bg-gray-200 text-blue-500 text-sm px-1 mx-1 font-extrabold"
                    to={`/address/${token.address}`}
                  >
                    {token.address}
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Total Supply:
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold">
                      {numToFixed(formatHexToInt(token.totalSupply), 2)}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    decimals:
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold">{token.decimals}</span>
                  </div>
                </td>
              </tr>
            </>
          )}
        </components.DynamicTable>
      </components.TableView>
    </div>
  );
}
