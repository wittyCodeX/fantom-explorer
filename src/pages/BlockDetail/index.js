import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import {
  formatHash,
  formatHexToInt,
  formatIntToHex,
  timestampToDate,
  numToFixed,
  isObjectEmpty,
  formatDate,
  addressToDomain,
} from "utils";
import moment from "moment";
import { ethers } from "ethers";

const GET_BLOCK = gql`
  query BlockByNumber($number: Long) {
    block(number: $number) {
      number
      transactionCount
      hash
      parent {
        hash
      }
      timestamp
      txList {
        hash
        from
        to
        value
        gasUsed
        block {
          number
          timestamp
        }
      }
    }
  }
`;
export default function BlockDetail() {
  const params = useParams();
  const [block, setBlock] = useState([]);
  const { loading, error, data } = useQuery(GET_BLOCK, {
    variables: {
      number: formatIntToHex(params.id),
    },
  });

  const columns = [
    "Tx Hash",
    "Block",
    "Time",
    "From",
    "To",
    "Value",
    "Txn Fee",
  ];

  useEffect(async () => {
    if (data) {
      const edges = data.block;
      setBlock(edges);
      await formatDomain(edges);
    }
  }, [loading]);

  const formatDomain = async (edges) => {
    let formatedData = [];
    let transactions = [];

    for (let i = 0; i < edges.txList.length; i++) {
      let edgeNew;

      const addressFrom = await addressToDomain(edges.txList[i].from);
      const addressTo = await addressToDomain(edges.txList[i].to);
      edgeNew = {
        ...edges.txList[i],
        from: addressFrom,
        to: addressTo,
        block: {
          ...edges.txList[i].block,
        },
      };
      formatedData.push(edgeNew);
    }
    transactions = {
      ...edges,
      txList: [...formatedData],
    };
    setBlock(transactions);
  };
  return (
    <div className="flex flex-col w-screen max-w-6xl">
      <div className="flex flex-row justify-between items-baseline bg-gray-200 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
        <div className="text-black flex flex-row gap-2 dark:text-gray-300 md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          <Link
            className="flex-none bg-transparent hover:bg-blue-100 dark:hover:bg-gray-700 text-center text-blue-700 dark:text-gray-300 font-semibold px-3 py-1 border border-blue-500 dark:border-gray-500 rounded text-sm"
            to={`/blocks/${Number(formatHexToInt(block.number) - 1)}`}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          Block #{formatHexToInt(block.number)}
          <Link
            className="flex-none bg-transparent hover:bg-blue-100 dark:hover:bg-gray-700 text-center text-blue-700 dark:text-gray-300 font-semibold px-3 py-1 border border-blue-500 dark:border-gray-500 rounded text-sm"
            to={`/blocks/${Number(formatHexToInt(block.number) + 1)}`}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <div className="text-black  dark:text-gray-300 text-sm">
          Home {">"} Blocks {">"} Block Detail
        </div>
      </div>
      <components.DynamicTable>
        {isObjectEmpty(block) ? (
          <tr>
            <td>
              <components.Loading />
            </td>
          </tr>
        ) : (
          <>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Block Height:
                </div>
                <div className="col-span-2">{formatHexToInt(block.number)}</div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Timestamp:
                </div>
                <div className="col-span-2">
                  {moment.unix(block.timestamp).fromNow()}{" "}
                  {`(${formatDate(timestampToDate(block.timestamp))})`}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Transactions:
                </div>
                <div className="col-span-2">
                  {formatHexToInt(block.transactionCount)} transactions
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Block Hash:
                </div>
                <div className="col-span-2  break-words">{block.hash}</div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Parent Hash:
                </div>
                <div className="col-span-2  break-words">
                  {block.parent?.hash}
                </div>
              </td>
            </tr>
          </>
        )}
      </components.DynamicTable>

      <components.DynamicTable columns={columns}>
        {loading ? (
          <tr>
            <td colSpan={columns?.length}>
              <components.Loading />
            </td>
          </tr>
        ) : (
          block.txList &&
          block.txList.map((item, index) => (
            <DynamicTableRow item={item} key={index} />
          ))
        )}
      </components.DynamicTable>
    </div>
  );
}
const DynamicTableRow = ({ item }) => {
  return (
    <tr>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500 dark:text-gray-300"
          to={`/transactions/${item.hash}`}
        >
          {" "}
          {formatHash(item.hash)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          to={`/blocks/${formatHexToInt(item.block.number)}`}
          className="text-blue-500 dark:text-gray-300"
        >
          #{formatHexToInt(item.block.number)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {moment.unix(item.block.timestamp).fromNow()}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500 dark:text-gray-300"
          to={`/address/${item.from}`}
        >
          {" "}
          {formatHash(item.from)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500 dark:text-gray-300"
          to={`/address/${item.to}`}
        >
          {" "}
          {formatHash(item.to)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {numToFixed(ethers.utils.formatEther(item.value), 2)} FTM
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <span className="text-sm">{formatHexToInt(item.gasUsed)}</span>
      </td>
    </tr>
  );
};
