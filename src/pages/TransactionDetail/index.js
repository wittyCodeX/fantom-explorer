import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Tooltip } from "@material-tailwind/react";

import services from "services";
import components from "components";
import {
  WEIToFTM,
  formatHexToInt,
  timestampToDate,
  numToFixed,
  isObjectEmpty,
  formatDate,
  addressToDomain,
  getTypeByStr,
} from "utils";
import moment from "moment";

const GET_TRANSACTION = gql`
  query TransactionByHash($hash: Bytes32!) {
    transaction(hash: $hash) {
      hash
      index
      nonce
      from
      to
      value
      gas
      gasUsed
      gasPrice
      inputData
      status
      block {
        hash
        number
        timestamp
      }
      tokenTransactions {
        trxIndex
        tokenAddress
        tokenName
        tokenSymbol
        tokenType
        tokenId
        tokenDecimals
        type
        sender
        recipient
        amount
      }
    }
  }
`;
export default function TransactionDetail() {
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const [type, setType] = useState("transaction");
  const [transaction, setTransaction] = useState([]);
  const { loading, error, data } = useQuery(GET_TRANSACTION, {
    variables: {
      hash: params.id,
    },
  });

  useEffect(async () => {
    if (data) {
      const edges = data;
      setTransaction(edges);
      await formatDomain(edges);
    }
  }, [loading]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setType("");
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  const formatDomain = async (edges) => {
    let edgeNew;
    const addressFrom = await addressToDomain(edges.transaction.from);
    const addressTo = await addressToDomain(edges.transaction.to);
    edgeNew = {
      ...edges.transaction,
      from: addressFrom,
      to: addressTo,
      block: {
        ...edges.transaction.block,
      },
    };
    setTransaction(edgeNew);
  };
  return (
    <div className="flex flex-col w-screen max-w-6xl">
      <div className="flex flex-row justify-between items-baseline bg-gray-200 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
        <div className="text-black  dark:text-gray-300 md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          Transaction Detail
        </div>
        <div className="text-black  dark:text-gray-300 text-sm">
          Home {">"} Transaction {">"} Transaction Detail
        </div>
      </div>
      <components.DynamicTable classes="py-2">
        {!transaction.hash ? (
          <tr>
            <td>
              <components.Loading />
            </td>
          </tr>
        ) : (
          <>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Transaction Hash:
                </div>
                <div className="col-span-2  break-words">
                  {transaction.hash}{" "}
                  <Tooltip content="Copy Tnx Hash to clipboard">
                    <button
                      onClick={() => {
                        setCopied(true);
                        setType("transaction");
                        navigator.clipboard.writeText(transaction.hash);
                      }}
                    >
                      <img
                        src={services.linking.static("images/copy.svg")}
                        className="mx-2 inline h-3 md:h-4 m-auto dark:w-8 dark:md:h-6"
                        data-tooltip-target="tooltip-default"
                        alt="Copy"
                      />
                    </button>
                  </Tooltip>
                  {copied && type == "transaction" ? (
                    <span className="text-black text-sm font-bold bg-gray-100">
                      Copied!
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Status:
                </div>
                <div className="col-span-2">
                  {formatHexToInt(transaction.status) === 1 ? (
                    <span className="rounded-full bg-green-500 px-2 py-1 text-white font-bold">
                      Success
                    </span>
                  ) : (
                    <span className="rounded-full px-2 py-1 bg-red-500">Fail</span>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Block:
                </div>
                <div className="col-span-2">
                  {formatHexToInt(transaction.block?.number)}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Timestamp:
                </div>
                <div className="col-span-2  break-words">
                  {moment.unix(transaction.block?.timestamp).fromNow()}{" "}
                  {`(${formatDate(
                    timestampToDate(transaction.block?.timestamp)
                  )})`}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  From:
                </div>
                <div className="col-span-2  break-words">
                  {getTypeByStr(transaction.from) === "address" ? (
                    <Link
                      className="text-blue-500 dark:text-gray-300"
                      to={`/address/${transaction.from}`}
                    >
                      {transaction.from}
                    </Link>
                  ) : (
                    <Link
                      className="text-blue-500 dark:text-gray-300"
                      to={`/domain/${transaction.from}`}
                    >
                      {transaction.from}
                    </Link>
                  )}
                  <Tooltip content="Copy Address to clipboard">
                    <button
                      onClick={() => {
                        setCopied(true);
                        setType("from");
                        navigator.clipboard.writeText(transaction.from);
                      }}
                    >
                      <img
                        src={services.linking.static("images/copy.svg")}
                        className="mx-2 inline h-3 md:h-4 m-auto dark:w-8 dark:md:h-6"
                        data-tooltip-target="tooltip-default"
                        alt="Copy"
                      />
                    </button>
                  </Tooltip>
                  {copied && type == "from" ? (
                    <span className="text-black text-sm font-bold p-1 bg-gray-100">
                      Copied!
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  To:
                </div>
                <div className="col-span-2  break-words">
                  {getTypeByStr(transaction.from) === "address" ? (
                    <Link
                      className="text-blue-500 dark:text-gray-300"
                      to={`/address/${transaction.to}`}
                    >
                      {transaction.to}
                    </Link>
                  ) : (
                    <Link
                      className="text-blue-500 dark:text-gray-300"
                      to={`/domain/${transaction.to}`}
                    >
                      {transaction.to}
                    </Link>
                  )}
                  <Tooltip content="Copy Address to clipboard">
                    <button
                      onClick={() => {
                        setCopied(true);
                        setType("to");
                        navigator.clipboard.writeText(transaction.to);
                      }}
                    >
                      <img
                        src={services.linking.static("images/copy.svg")}
                        className="mx-2 inline h-3 md:h-4 m-auto dark:w-8 dark:md:h-6"
                        data-tooltip-target="tooltip-default"
                        alt="Copy"
                      />
                    </button>
                  </Tooltip>
                  {copied && type == "to" ? (
                    <span className="text-black text-sm font-bold p-1 bg-gray-100">
                      Copied!
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Value:
                </div>
                <div className="col-span-2">
                  {numToFixed(
                    //   ethers.utils.formatEther(
                    formatHexToInt(transaction.value),
                    //   ),
                    2
                  )}{" "}
                  FTM
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Gas Used:
                </div>
                <div className="col-span-2">
                  {formatHexToInt(transaction.gasUsed)}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Gas Price:
                </div>
                <div className="col-span-2">
                  {formatHexToInt(transaction.gasPrice)} WEI
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Nonce:
                </div>
                <div className="col-span-2">
                  {formatHexToInt(transaction.nonce)}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Transaction Fee:
                </div>
                <div className="col-span-2">
                  {WEIToFTM(
                    formatHexToInt(transaction.gasPrice) *
                      formatHexToInt(transaction.gasUsed)
                  )}{" "}
                  FTM
                </div>
              </td>
            </tr>

            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700  p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Input Data:
                </div>
                <div className="col-span-2 break-words bg-gray-300 dark:bg-[#2c2e3f] dark:text-gray-300 border border-gray-400 p-4">
                  {transaction.inputData}
                </div>
              </td>
            </tr>
          </>
        )}
      </components.DynamicTable>
    </div>
  );
}
