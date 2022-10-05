import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import { formatHexToInt, formatHash, numToFixed, WEIToFTM } from "utils";
import moment from "moment";
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

const columns = [
  {
    name: "Txn Hash",
    selector: (row) => row.transaction.hash,
    cell: (row) => (
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/transactions/${row.transaction.hash}`}
      >
        {" "}
        {formatHash(row.transaction.hash)}
      </Link>
    ),
    sortable: true,
    grow: 1,
  },
  {
    name: "Block",
    selector: (row) => row.transaction.block.number,
    cell: (row) => (
      <Link
        to={`/blocks/${formatHexToInt(row.transaction.block.number)}`}
        className="text-blue-500 dark:text-gray-300"
      >
        #{formatHexToInt(row.transaction.block.number)}
      </Link>
    ),
    maxWidth: "50px",
  },
  {
    name: "Time",
    selector: (row) => row.transaction.block.timestamp,
    cell: (row) => (
      <span className="text-black dark:text-gray-300">
        {moment.unix(row.transaction.block.timestamp).fromNow()}
      </span>
    ),
  },
  {
    name: "From",
    selector: (row) => row.transaction.from,
    cell: (row) => (
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/address/${row.transaction.from}`}
      >
        {" "}
        {formatHash(row.transaction.from)}
      </Link>
    ),
    sortable: true,
  },
  {
    name: "T0",
    selector: (row) => row.transaction.to,
    cell: (row) => (
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/address/${row.transaction.to}`}
      >
        {" "}
        {formatHash(row.transaction.to)}
      </Link>
    ),
    sortable: true,
  },
  {
    name: "Value",
    selector: (row) => row.transaction.value,
    cell: (row) => (
      <span className="text-black dark:text-gray-300">
        {numToFixed(WEIToFTM(row.transaction.value), 2)} FTM
      </span>
    ),
    sortable: true,
    maxWidth: "250px",
  },
  {
    name: "Txn Fee",
    selector: (row) => row.transaction.gasUsed,
    cell: (row) => (
      <span className="text-sm text-black dark:text-gray-300">
        {formatHexToInt(row.transaction.gasUsed)}
      </span>
    ),
    sortable: true,
    maxWidth: "130px",
  },
];
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

  const updateQuery = async (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }

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
    setRows(transactions);

    return { ...fetchMoreResult };
  };

  const fetchMoreData = (cursor, size = 25) => {
    if (data && fetchMore) {
        fetchMore({ updateQuery, variables: { cursor: cursor, count: size } });
    }
  };

  useEffect(async () => {
    if (data) {
      const edges = data.transactions.edges;
      setRows(edges);
    }
  }, [loading]);

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
  }, [loading]);

  return (
    <div className="flex flex-col">
      {rows && (
        <components.TableView
          classes="w-screen max-w-6xl"
          title="Transactions"
          columns={columns}
          loading={loading}
          data={rows}
          totalCount={totalCount}
          fetchMoreData={fetchMoreData}
        />
      )}
    </div>
  );
}