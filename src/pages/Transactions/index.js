import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import {
  formatHexToInt,
  formatHash,
  numToFixed,
  WEIToFTM,
  addressToDomain
} from "utils";
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
    selector: row => row.transaction.hash,
    cell: row =>
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/tx/${row.transaction.hash}`}
      >
        {" "}{formatHash(row.transaction.hash)}
      </Link>,
    sortable: true,
    grow: 1
  },
  {
    name: "Block",
    selector: row => row.transaction.block.number,
    cell: row =>
      <Link
        to={`/block/${formatHexToInt(row.transaction.block.number)}`}
        className="text-blue-500 dark:text-gray-300"
      >
        #{formatHexToInt(row.transaction.block.number)}
      </Link>,
    maxWidth: "50px"
  },
  {
    name: "Time",
    selector: row => row.transaction.block.timestamp,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {moment.unix(row.transaction.block.timestamp).fromNow()}
      </span>
  },
  {
    name: "From",
    selector: row => row.transaction.from,
    cell: row =>
      <Link
        className="flex flex-row items-center justify-between lg:gap-3 md:gap-3 sm:gap-2 gap-2 text-blue-500 dark:text-gray-300"
        to={`/address/${row.transaction.from}`}
      >
        <span>
          {formatHash(row.transaction.from)}
        </span>
        <img
          src={services.linking.static("images/arrow-right.svg")}
          alt="from"
          srcSet=""
          className="w-4"
        />
      </Link>,
    grow: 1,
    sortable: true
  },
  {
    name: "T0",
    selector: row => row.transaction.to,
    cell: row =>
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/address/${row.transaction.to}`}
      >
        {" "}{formatHash(row.transaction.to)}
      </Link>,
    grow: 1,
    sortable: true
  },
  {
    name: "Value",
    selector: row => row.transaction.value,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {numToFixed(WEIToFTM(row.transaction.value), 2)} FTM
      </span>,
    sortable: true,
    maxWidth: "250px"
  },
  {
    name: "Txn Fee",
    selector: row => row.transaction.gasUsed,
    cell: row =>
      <span className="text-sm text-black dark:text-gray-300">
        {formatHexToInt(row.transaction.gasUsed)}
      </span>,
    sortable: true,
    maxWidth: "130px"
  }
];
export default function Transactions() {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInfo, setPageInfo] = useState({});
  const [perPage, setPerPage] = useState(25);
  const { loading, error, data, fetchMore } = useQuery(GET_TRANSACTIONS, {
    variables: {
      cursor: null,
      count: perPage
    }
  });

  const updateQuery = async (previousResult, { fetchMoreResult }) => {
    console.log("fetch more result: ", fetchMoreResult);
    if (!fetchMoreResult) {
      return previousResult;
    }
    setPageInfo(fetchMoreResult.transactions.pageInfo);
    setRows(fetchMoreResult.transactions.edges);
    await formatDomain(fetchMoreResult.transactions.edges);
    return { ...fetchMoreResult };
  };

  const fetchMoreData = (cursor, size = 25) => {
    if (data && fetchMore) {
      fetchMore({ updateQuery, variables: { cursor: cursor, count: size } });
    }
  };
  useEffect(
    async () => {
      if (data && data.transactions) {
        setTotalCount(formatHexToInt(data.transactions.totalCount));
        const edges = data.transactions.edges;
        setPerPage(25);
        setPageInfo(data.transactions.pageInfo);
        setRows(edges);
        await formatDomain(data.transactions.edges);
      }
    },
    [loading]
  );

  const formatDomain = async data => {
    let formatedData = [];

    for (let i = 0; i < data.length; i++) {
      let edgeNew;

      const addressFrom = await addressToDomain(data[i].transaction.from);
      const addressTo = await addressToDomain(data[i].transaction.to);
      edgeNew = {
        ...data[i],
        transaction: {
          ...data[i].transaction,
          from: addressFrom,
          to: addressTo
        }
      };
      formatedData.push(edgeNew);
    }
    setRows(formatedData);
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-baseline bg-gray-200 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
        <div className="text-black  dark:text-gray-300 md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          Transactions
        </div>
        <div className="text-black  dark:text-gray-300 text-sm">
          Home {">"} Transactions
        </div>
      </div>
      {rows &&
        <components.TableView
          classes="w-screen max-w-6xl"
          title="Transactions"
          columns={columns}
          loading={loading}
          data={rows}
          isCustomPagination={true}
          pageInfo={pageInfo}
          totalCount={totalCount}
          fetchMoreData={fetchMoreData}
        />}
    </div>
  );
}
