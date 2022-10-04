import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import components from "components";
import { formatHexToInt, formatHash, numToFixed } from "utils";
import moment from "moment";
import { ethers } from "ethers";
import services from "services";

const GET_TRANSACTIONS = gql`
  query TransactionList($cursor: Cursor, $count: Int!) {
    transactions(cursor: $cursor, count: $count) {
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
  }
`;

export default function Transactions() {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const count = 15;
  const { loading, error, data, fetchMore } = useQuery(GET_TRANSACTIONS, {
    variables: {
      cursor: null,
      count: count,
    },
  });

  const getHasNextPage = (data) => data.pageInfo.hasNext;

  const getAfter = (data) =>
    data.edges && data.edges.length > 0
      ? data.edges[data.edges.length - 1].cursor
      : null;

  const updateQuery = async (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }

    fetchMoreResult.transactions.edges = [
      ...previousResult.transactions.edges,
      ...fetchMoreResult.transactions.edges,
    ];
    let transactions = [];
    const api = services.provider.buildAPI();

    for (let i = 0; i < fetchMoreResult.transactions.edges.length; i++) {
      let edgeNew;

      let addressFrom;
      try {
        const nameHash = await api.contracts.EVMReverseResolverV1.get(
          fetchMoreResult.transactions.edges[i].transaction.from
        );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        addressFrom = await clients.utils.decodeNameHashInputSignals(
          nameSignal
        );
      } catch {
        addressFrom = fetchMoreResult.transactions.edges[i].transaction.from;
      }
      let addressTo;
      try {
        const nameHash = await api.contracts.EVMReverseResolverV1.get(
          fetchMoreResult.transactions.edges[i].transaction.to
        );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        addressTo = await clients.utils.decodeNameHashInputSignals(nameSignal);
      } catch {
        addressTo = fetchMoreResult.transactions.edges[i].transaction.to;
      }

      edgeNew = {
        cursor: fetchMoreResult.transactions.edges[i].cursor,
        transaction: {
          from: addressFrom,
          to: addressTo,
          hash: fetchMoreResult.transactions.edges[i].transaction.hash,
          value: fetchMoreResult.transactions.edges[i].transaction.value,
          gasUsed: fetchMoreResult.transactions.edges[i].transaction.gasUsed,
          block: {
            number:
              fetchMoreResult.transactions.edges[i].transaction.block.number,
            timestamp:
              fetchMoreResult.transactions.edges[i].transaction.block.timestamp,
          },
        },
      };

      transactions.push(edgeNew);
    }
    setRows(rows.concat(transactions));

    return { ...fetchMoreResult };
  };

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.transactions);
      const after = getAfter(data.transactions);
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } });
      }
    }
  };
  useEffect(async () => {
    if (data) {
      const edges = data.transactions.edges;
      setRows(edges);
    }
  }, [data]);
  useEffect(async () => {
    if (data) {
      setTotalCount(formatHexToInt(data.transactions.totalCount));
      let transactions = [];
      const api = services.provider.buildAPI();

      for (let i = 0; i < data.transactions.edges.length; i++) {
        let edgeNew;

        let addressFrom;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            data.transactions.edges[i].transaction.from
          );
          const nameSignal = await api.contracts.RainbowTableV1.lookup(
            nameHash.name
          );
          addressFrom = await clients.utils.decodeNameHashInputSignals(
            nameSignal
          );
        } catch {
          addressFrom = data.transactions.edges[i].transaction.from;
        }
        let addressTo;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            data.transactions.edges[i].transaction.to
          );
          const nameSignal = await api.contracts.RainbowTableV1.lookup(
            nameHash.name
          );
          addressTo = await clients.utils.decodeNameHashInputSignals(
            nameSignal
          );
        } catch {
          addressTo = data.transactions.edges[i].transaction.to;
        }

        edgeNew = {
          cursor: data.transactions.edges[i].cursor,
          transaction: {
            from: addressFrom,
            to: addressTo,
            hash: data.transactions.edges[i].transaction.hash,
            value: data.transactions.edges[i].transaction.value,
            gasUsed: data.transactions.edges[i].transaction.gasUsed,
            block: {
              number: data.transactions.edges[i].transaction.block.number,
              timestamp: data.transactions.edges[i].transaction.block.timestamp,
            },
          },
        };

        transactions.push(edgeNew);
      }
      setRows(transactions);
    }
  }, [data]);

  const columns = [
    "Tx Hash",
    "Block",
    "Time",
    "From",
    "To",
    "Value",
    "Txn Fee",
  ];
  return (
    <components.TableView classes="w-screen max-w-6xl" title="Transactions">
      <div className="flex flex-col justify-between px-2 py-5">
        <div>
          More than {">"} {formatHexToInt(data?.transactions.totalCount)}{" "}
          transactions found
        </div>
        <div className="text-sm text-gray-500">
          Showing last {rows?.length} transactions
        </div>
      </div>
      <InfiniteScroll
        dataLength={totalCount}
        next={fetchMoreData}
        hasMore={true}
        loader={<div className="text-center">Loading Data...</div>}
      >
        <components.DynamicTable columns={columns}>
          {rows.length > 0 ? (
            rows &&
            rows.map((item, index) => (
              <DynamicTableRow item={item} key={index} />
            ))
          ) : (
            <tr>
              <td colSpan={columns?.length}>
                <components.Loading />
              </td>
            </tr>
          )}
        </components.DynamicTable>
      </InfiniteScroll>
    </components.TableView>
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
