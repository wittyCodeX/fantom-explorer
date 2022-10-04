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
} from "utils";
import moment from "moment";

const GET_BLOCK = gql`
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
  const { loading, error, data } = useQuery(GET_BLOCK, {
    variables: {
      hash: params.id,
    },
  });

  useEffect(async () => {
    if (data) {
      const edges = data;
      setTransaction(edges);
    }
  }, [data]);
  useEffect(async () => {
    if (data) {
      const edges = data;
      setTransaction(edges);

      const api = services.provider.buildAPI();
      let edgeNew;

      let addressFrom;
      try {
        const nameHash = await api.contracts.EVMReverseResolverV1.get(
          edges.transaction.from
        );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        addressFrom = await clients.utils.decodeNameHashInputSignals(
          nameSignal
        );
      } catch {
        addressFrom = edges.transaction.from;
      }
      let addressTo;
      try {
        const nameHash = await api.contracts.EVMReverseResolverV1.get(
          edges.transaction.to
        );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        addressTo = await clients.utils.decodeNameHashInputSignals(nameSignal);
      } catch {
        addressTo = edges.transaction.to;
      }

      edgeNew = {
        from: addressFrom,
        to: addressTo,
        hash: edges.transaction.hash,
        value: edges.transaction.value,
        gasUsed: edges.transaction.gasUsed,
        index: edges.transaction.index,
        nonce: edges.transaction.nonce,
        gas: edges.transaction.gas,
        gasPrice: edges.transaction.gasPrice,
        inputData: edges.transaction.inputData,
        status: edges.transaction.status,
        block: {
          number: edges.transaction.block.number,
          timestamp: edges.transaction.block.timestamp,
        },
      };
      setTransaction(edgeNew);
    }
  }, [data]);
  console.log(isObjectEmpty(transaction));

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setType("");
        setCopied(false);
      }, 1000);
    }
  }, [copied]);
  return (
    <div>
      <components.TableView
        classes="w-screen max-w-6xl"
        title={`Transaction Details`}
        dontNeedSubtitle={true}
      >
        <components.DynamicTable>
          {isObjectEmpty(transaction) ? (
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
                          src={services.linking.static("images/copied.png")}
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
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Status:
                  </div>
                  <div className="col-span-2">
                    {formatHexToInt(transaction.status) === 1 ? (
                      <span className="rounded-full bg-green-500 px-2 py-1 text-white font-bold">
                        Success
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-500">Fail</span>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Block:
                  </div>
                  <div className="col-span-2">
                    {formatHexToInt(transaction.block?.number)}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
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
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    From:
                  </div>
                  <div className="col-span-2  break-words">
                    <Link
                      className="text-blue-500 dark:text-gray-300"
                      to={`/address/${transaction.from}`}
                    >
                      {transaction.from}
                    </Link>
                    <Tooltip content="Copy Address to clipboard">
                      <button
                        onClick={() => {
                          setCopied(true);
                          setType("from");
                          navigator.clipboard.writeText(transaction.from);
                        }}
                      >
                        <img
                          src={services.linking.static("images/copied.png")}
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
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    To:
                  </div>
                  <div className="col-span-2  break-words">
                    <Link
                      className="text-blue-500 dark:text-gray-300"
                      to={`/address/${transaction.to}`}
                    >
                      {transaction.to}
                    </Link>
                    <Tooltip content="Copy Address to clipboard">
                      <button
                        onClick={() => {
                          setCopied(true);
                          setType("to");
                          navigator.clipboard.writeText(transaction.to);
                        }}
                      >
                        <img
                          src={services.linking.static("images/copied.png")}
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
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
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
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Gas Used:
                  </div>
                  <div className="col-span-2">
                    {formatHexToInt(transaction.gasUsed)}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Gas Price:
                  </div>
                  <div className="col-span-2">
                    {formatHexToInt(transaction.gasPrice)} WEI
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Nonce:
                  </div>
                  <div className="col-span-2">
                    {formatHexToInt(transaction.nonce)}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
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
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Input Data:
                  </div>
                  <div className="col-span-2 break-words">
                    {transaction.inputData}
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
