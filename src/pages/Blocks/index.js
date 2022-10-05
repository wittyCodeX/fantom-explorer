import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import { formatHexToInt, timestampToDate, formatDate, formatHash } from "utils";
import moment from "moment";

const GET_BLOCKS = gql`
  query BlockList($cursor: Cursor, $count: Int!) {
    blocks(cursor: $cursor, count: $count) {
      totalCount
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      edges {
        block {
          hash
          number
          timestamp
          transactionCount
          gasUsed
        }
        cursor
      }
    }
  }
`;

const columns = [
  {
    name: "Block",
    selector: row => row.block.number,
    cell: row =>
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/blocks/${formatHexToInt(row.block.number)}`}
      >
        {" "}{formatHexToInt(row.block.number)}
      </Link>,
    sortable: true
  },
  {
    name: "Time",
    selector: row => row.block.timestamp,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {formatDate(timestampToDate(row.block.timestamp).toString())}
      </span>,
    grow: 2
  },
  {
    name: "Age",
    selector: row => row.block.timestamp,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {moment.unix(row.block.timestamp).fromNow()}
      </span>,
    sortable: true
  },
  {
    name: "Txn",
    selector: row => row.block.transactionCount,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {formatHexToInt(row.block.transactionCount)}
      </span>,
    maxWidth: "50px",
    sortable: true
  },
  {
    name: "Gas Used",
    selector: row => row.block.gasUsed,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {formatHexToInt(row.block.gasUsed)}
      </span>,
    maxWidth: "150px",
    sortable: true
  },
  {
    name: "Block Hash",
    selector: row => row.block.hash,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {formatHash(row.block.hash)}
      </span>,
    grow: 1
  }
];

export default function Blocks() {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage] = useState(25);
  const { loading, error, data, fetchMore } = useQuery(GET_BLOCKS, {
    variables: {
      cursor: null,
      count: perPage
    }
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
    setRows(fetchMoreResult.blocks.edges);
    return { ...fetchMoreResult };
  };

  const fetchMoreData = (page, size = perPage) => {
    if (data && fetchMore) {
      fetchMore({ updateQuery, variables: { cursor: page, count: size } });
    }
  };
  useEffect(
    () => {
      if (data && data.blocks) {
        setTotalCount(formatHexToInt(data.blocks.totalCount));
        setRows(data.blocks.edges);
      }
    },
    [loading]
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-baseline bg-gray-200 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
        <div className="text-black  dark:text-gray-300 md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          Blocks
        </div>
        <div className="text-black  dark:text-gray-300 text-sm">
          Home {">"} Blocks
        </div>
      </div>
      {rows &&
        <components.TableView
          classes="w-screen max-w-6xl"
          title="Blocks"
          columns={columns}
          loading={loading}
          data={rows}
          totalCount={totalCount}
          fetchMoreData={fetchMoreData}
        />}
    </div>
  );
}
