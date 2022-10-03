import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { ethers } from "ethers";
import QRCode from "react-qr-code";
import { Tooltip } from "@material-tailwind/react";
import InfiniteScroll from "react-infinite-scroll-component";

import components from "components";
import {
  formatHash,
  formatHexToInt,
  numToFixed,
  WEIToFTM,
  isObjectEmpty,
} from "utils";
import moment from "moment";
import services from "services";
import clients from "clients";

import ERC1155TransactionList from "./ERC1155TransactionList";
import ERC20TransactionList from "./ERC20TransactionList";
import ERC721TransactionList from "./ERC721TransactionList";

const GET_BLOCK = gql`
  query AccountByAddress($address: Address!, $cursor: Cursor, $count: Int!) {
    account(address: $address) {
      address
      contract {
        address
        deployedBy {
          hash
          contractAddress
        }
        name
        version
        compiler
        sourceCode
        abi
        validated
        supportContact
        timestamp
      }
      balance
      totalValue
      txCount
      txList(cursor: $cursor, count: $count) {
        pageInfo {
          first
          last
          hasNext
          hasPrevious
        }
        totalCount
        edges {
          cursor
          transaction {
            hash
            from
            to
            value
            gasUsed
            block {
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
      }
      staker {
        id
        createdTime
        isActive
      }
      delegations {
        totalCount
        edges {
          delegation {
            toStakerId
            createdTime
            amount
            claimedReward
            pendingRewards {
              amount
            }
          }
          cursor
        }
      }
    }
  }
`;
export default function Address() {
  const params = useParams();

  const [block, setBlock] = useState([]);
  const [address, setAddress] = useState("");
  const [delegated, setDelegated] = useState([]);
  const [pendingReward, setPendingReward] = useState([]);
  const [claimedReward, setClaimedReward] = useState([]);

  const [erc20Count, setERC20Count] = useState("");
  const [erc721Count, setERC721Count] = useState("");
  const [erc1155Count, setERC1155Count] = useState("");

  const [ftmPrice, setFtmPrice] = useState("");

  const [copied, setCopied] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const count = 10;

  //   const type = getTypeByStr(params.id)
  //   let address = params.id
  //   if (type == 'address') {
  //     address = params.id
  //   } else {
  //     address = await domainToAddress(params.id)
  //   }
  const { loading, error, data, fetchMore } = useQuery(GET_BLOCK, {
    variables: {
      address: params.id,
      cursor: null,
      count: count,
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

  useEffect(() => {
    const calculateFtmValue = async (_ftmBalance) => {
      const api = services.provider.buildAPI();
      const rate = await api.getFTMConversionRateFromChainlink(
        "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc"
      );
      const price =
        (rate / Math.pow(10, 8)) * WEIToFTM(formatHexToInt(block.balance));
      setFtmPrice(price);
    };
    calculateFtmValue(WEIToFTM(formatHexToInt(block.balance)));
  }, [block.balance]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  useEffect(async () => {
    if (data) {
      const account = data.account;
      let delegated = 0;
      let pending_rewards = 0;
      let claimed_rewards = 0;
      if (account.delegations && account.delegations.edges) {
        account.delegations.edges.forEach((_edge) => {
          const { delegation } = _edge;
          delegated += delegation ? WEIToFTM(delegation.amount) : 0;
          pending_rewards +=
            delegation && delegation.pendingRewards
              ? WEIToFTM(delegation.pendingRewards.amount)
              : 0;
          claimed_rewards += delegation
            ? WEIToFTM(delegation.claimedReward)
            : 0;
        });
      }

      setDelegated(delegated);
      setPendingReward(pending_rewards);
      setClaimedReward(claimed_rewards);
      setBlock(account);

      let newAddressData;
      let transactions = [];
      const api = services.provider.buildAPI();

      let address;
      try {
        const nameHash = await api.contracts.EVMReverseResolverV1.get(
          account.address
        );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        address = await clients.utils.decodeNameHashInputSignals(nameSignal);
      } catch {
        address = account.address;
      }

      setAddress(address);

      for (let i = 0; i < account.txList.edges.length; i++) {
        let edgeNew;

        let addressFrom;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            account.txList.edges[i].transaction.from
          );
          const nameSignal = await api.contracts.RainbowTableV1.lookup(
            nameHash.name
          );
          addressFrom = await clients.utils.decodeNameHashInputSignals(nameSignal);
        } catch {
          addressFrom = account.txList.edges[i].transaction.from;
        }
        let addressTo;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            account.txList.edges[i].transaction.to
          );
          const nameSignal = await api.contracts.RainbowTableV1.lookup(
            nameHash.name
          );
          addressTo = await clients.utils.decodeNameHashInputSignals(nameSignal);
        } catch {
          addressTo = account.txList.edges[i].transaction.to;
        }

        edgeNew = {
          cursor: account.txList.edges[i].cursor,
          transaction: {
            from: addressFrom,
            to: addressTo,
            hash: account.txList.edges[i].transaction.hash,
            value: account.txList.edges[i].transaction.value,
            gasUsed: account.txList.edges[i].transaction.gasUsed,
            block: {
              number: account.txList.edges[i].transaction.block.number,
              timestamp: account.txList.edges[i].transaction.block.timestamp,
            },
          },
        };
        transactions.push(edgeNew);
      }
      newAddressData = {
        address: address,
        balance: account.balance,
        totalValue: account.totalValue,
        txCount: account.txCount,
        txList: {
          pageInfo: {
            first: account.txList.pageInfo.first,
            last: account.txList.pageInfo.last,
            hasNext: account.txList.pageInfo.hasNext,
            hasPrevious: account.txList.pageInfo.hasPrevious,
          },
          totalCount: account.txList.totalCount,
          edges: [...transactions],
        },
      };
      setBlock(newAddressData);
    }
  }, [data]);

  const getHasNextPage = (data) => data.txList.pageInfo.hasNext;

  const getAfter = (data) =>
    data.txList.edges && data.txList.edges.length > 0
      ? data.txList.edges[data.txList.edges.length - 1].cursor
      : null;

  const updateQuery = async (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }

    const account = fetchMoreResult.account;
    let newAddressData;
    let transactions = [];
    const api = services.provider.buildAPI();

    let address;
    try {
      const nameHash = await api.contracts.EVMReverseResolverV1.get(
        account.address
      );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        address = await clients.utils.decodeNameHashInputSignals(nameSignal);
    } catch {
      address = account.address;
    }

    for (let i = 0; i < account.txList.edges.length; i++) {
      let edgeNew;

      let addressFrom;
      try {
        const nameHash = await api.contracts.EVMReverseResolverV1.get(
          account.txList.edges[i].transaction.from
        );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        addressFrom = await clients.utils.decodeNameHashInputSignals(nameSignal);
      } catch {
        addressFrom = account.txList.edges[i].transaction.from;
      }
      let addressTo;
      try {
        const nameHash = await api.contracts.EVMReverseResolverV1.get(
          account.txList.edges[i].transaction.to
        );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        addressTo = await clients.utils.decodeNameHashInputSignals(nameSignal);
      } catch {
        addressTo = account.txList.edges[i].transaction.to;
      }

      edgeNew = {
        cursor: account.txList.edges[i].cursor,
        transaction: {
          from: addressFrom,
          to: addressTo,
          hash: account.txList.edges[i].transaction.hash,
          value: account.txList.edges[i].transaction.value,
          gasUsed: account.txList.edges[i].transaction.gasUsed,
          block: {
            number: account.txList.edges[i].transaction.block?.number,
            timestamp: account.txList.edges[i].transaction.block?.timestamp,
          },
        },
      };
      transactions.push(edgeNew);
    }

    fetchMoreResult.account.txList.edges = [
      ...previousResult.account.txList.edges,
      ...transactions,
    ];
    setBlock(fetchMoreResult.account);
    return { ...fetchMoreResult };
  };

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.account);
      const after = getAfter(data.account);
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } });
      }
    }
  };

  return (
    <div className="w-screen max-w-7xl">
      <div className="flex items-center text-black md:text-xl sm:text-xl text-sm  px-2 font-normal border-b p-3  mt-[30px] bg-gray-200">
        <QRCode value={params.id} size={20} />{" "}
        <span className="mx-3"> Address </span>
        <span className="font-bold">{address}</span>
        <Tooltip content="Copy Address to clipboard">
          <button
            onClick={() => {
              setCopied(true);
              navigator.clipboard.writeText(params.id);
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
        {copied ? (
          <span className="text-black text-sm font-bold bg-gray-100">
            Copied!
          </span>
        ) : (
          ""
        )}
      </div>

      <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 p-4 sm:p-0  mt-[10px]">
        <components.TableView title={`Overview`} dontNeedSubtitle={true}>
          <table className="w-full">
            <tbody>
              {loading ? (
                <tr>
                  <td>
                    <components.Loading />
                  </td>
                </tr>
              ) : (
                <>
                  <tr>
                    <td className="flex justify-between border-b md:p-3 p-3">
                      <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                        Balance:
                      </div>
                      <div className="mr-9">
                        {WEIToFTM(formatHexToInt(block.balance))} FTM
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="flex justify-between border-b md:p-3 p-3">
                      <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                        Available:
                      </div>
                      <div className="mr-9">
                        {WEIToFTM(formatHexToInt(block.totalValue))} FTM
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="flex justify-between border-b md:p-3 p-3">
                      <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                        FTM Value:
                      </div>
                      <div className="mr-9">{numToFixed(ftmPrice, 2)} $</div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </components.TableView>
        <components.TableView title={`More Info`} dontNeedSubtitle={true}>
          <table className="w-full">
            <tbody>
              {loading ? (
                <tr>
                  <td>
                    <components.Loading />
                  </td>
                </tr>
              ) : (
                <>
                  <tr>
                    <td className="flex justify-between  border-b p-3">
                      <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                        Delegated:
                      </div>
                      <div className="col-span-2">{delegated} FTM</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="flex justify-between  border-b p-3">
                      <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                        Pending Rewards:
                      </div>
                      <div className="col-span-2  break-words">
                        {pendingReward} FTM
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="flex justify-between  border-b p-3">
                      <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                        Claimed Rewards:
                      </div>
                      <div className="col-span-2  break-words">
                        {claimedReward} FTM
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </components.TableView>
      </div>

      <div className="bg-white text-gray-600 p-2">
        <div className="flex space-x-3 border-b">
          {/* Loop through tab data and render button for each. */}
          <button
            className={`p-2 border-b-4 transition-colors duration-300 ${
              0 === activeTabIndex
                ? "border-teal-500"
                : "border-transparent hover:border-gray-200"
            }`}
            // Change the active tab on click.
            onClick={() => setActiveTabIndex(0)}
          >
            Transactions {`(${formatHexToInt(data?.account?.txCount)})`}
          </button>
          <button
            className={`p-2 border-b-4 transition-colors duration-300 ${
              1 === activeTabIndex
                ? "border-teal-500"
                : "border-transparent hover:border-gray-200"
            }`}
            // Change the active tab on click.
            onClick={() => setActiveTabIndex(1)}
          >
            ERC-20 Token Txns {`( ${formatHexToInt(erc20Count)} )`}
          </button>
          <button
            className={`p-2 border-b-4 transition-colors duration-300 ${
              2 === activeTabIndex
                ? "border-teal-500"
                : "border-transparent hover:border-gray-200"
            }`}
            // Change the active tab on click.
            onClick={() => setActiveTabIndex(2)}
          >
            ERC-721 Token Txns {`( ${formatHexToInt(erc721Count)} )`}
          </button>
          <button
            className={`p-2 border-b-4 transition-colors duration-300 ${
              3 === activeTabIndex
                ? "border-teal-500"
                : "border-transparent hover:border-gray-200"
            }`}
            // Change the active tab on click.
            onClick={() => setActiveTabIndex(3)}
          >
            ERC-1155 Token Txns {`( ${formatHexToInt(erc1155Count)} )`}
          </button>
        </div>
        {/* Show active tab content. */}
        <div className="py-4">
          {data && activeTabIndex === 0 ? (
            <InfiniteScroll
              dataLength={formatHexToInt(data?.account?.txCount)}
              next={fetchMoreData}
              hasMore={true}
              loader={<div className="text-center">Loading More...</div>}
            >
              <div className="flex flex-col justify-between px-2 py-5">
                <div></div>
                <div className="text-sm text-gray-500">
                  Showing last {block.txList?.edges.length} transactions
                </div>
              </div>
              <components.DynamicTable columns={columns}>
                {isObjectEmpty(block) ? (
                  <tr>
                    <td colSpan={columns?.length}>
                      <components.Loading />
                    </td>
                  </tr>
                ) : (
                  block &&
                  block.txList?.edges.map((item, index) => (
                    <DynamicTableRow item={item} key={index} />
                  ))
                )}
              </components.DynamicTable>
            </InfiniteScroll>
          ) : activeTabIndex === 1 ? (
            <ERC20TransactionList
              address={params.id}
              setTotal={setERC20Count}
            />
          ) : activeTabIndex === 2 ? (
            <ERC721TransactionList
              address={params.id}
              setTotal={setERC721Count}
            />
          ) : activeTabIndex === 3 ? (
            <ERC1155TransactionList
              address={params.id}
              setTotal={setERC1155Count}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

const DynamicTableRow = ({ item }) => {
  return (
    <tr>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500 dark:text-gray-300"
          to={`/transactions/${item.transaction.hash}`}
        >
          {" "}
          {formatHash(item.transaction.hash)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          to={`/blocks/${formatHexToInt(item.transaction.block.number)}`}
          className="text-blue-500 dark:text-gray-300"
        >
          #{formatHexToInt(item.transaction.block.number)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {moment.unix(item.transaction.block.timestamp).fromNow()}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500 dark:text-gray-300"
          to={`/address/${item.transaction.from}`}
        >
          {" "}
          {formatHash(item.transaction.from)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500 dark:text-gray-300"
          to={`/address/${item.transaction.to}`}
        >
          {" "}
          {formatHash(item.transaction.to)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {numToFixed(ethers.utils.formatEther(item.transaction.value), 2)} FTM
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <span className="text-sm">
          {formatHexToInt(item.transaction.gasUsed)}
        </span>
      </td>
    </tr>
  );
};
