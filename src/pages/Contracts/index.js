import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import { formatHexToInt, formatHash, timestampToDate, formatDate } from "utils";

const GET_CONTRACTS = gql`
  query ContractList($cursor: Cursor, $count: Int!) {
    contracts(cursor: $cursor, count: $count) {
      totalCount
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      edges {
        contract {
          address
          deployedBy {
            hash
          }
          transactionHash
          name
          version
          compiler
          validated
          timestamp
        }
        cursor
      }
    }
  }
`;

const columns = [
  {
    name: "Address",
    selector: row => row.contract.address,
    cell: row =>
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/address/${row.contract.address}`}
      >
        {formatHash(row.contract.address)}
      </Link>
  },
  {
    name: "Name",
    selector: row => row.contract.name,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {row.contract.name}{" "}
      </span>
  },
  {
    name: "Compiler",
    selector: row => row.contract.compiler,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {row.contract.compiler}
      </span>,
    sortable: true
  },
  {
    name: "Version",
    selector: row => row.contract.transactionCount,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {formatHexToInt(row.contract.transactionCount)}
      </span>,
    sortable: true
  },
  {
    name: "Validated",
    selector: row => row.contract.version,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {formatHexToInt(row.contract.version)}
      </span>,
    sortable: true
  },
  {
    name: "Time",
    selector: row => row.contract.timestamp,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {`(${formatDate(timestampToDate(row.contract.timestamp))})`}
      </span>,
    right: true,
    grow: 2
  }
];
export default function Contracts() {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [pageInfo, setPageInfo] = useState({});
  const { loading, error, data, fetchMore } = useQuery(GET_CONTRACTS, {
    variables: {
      validatedOnly: true,
      cursor: null,
      count: perPage
    }
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
    setPageInfo(fetchMoreResult.contracts.pageInfo);
    setRows(fetchMoreResult.contracts.edges);
    return { ...fetchMoreResult };
  };

  const fetchMoreData = (page, size = perPage) => {
    if (data && fetchMore) {
      fetchMore({
        updateQuery,
        variables: { cursor: page, count: size, validatedOnly: true }
      });
    }
  };
  useEffect(
    () => {
      if (data) {
        setTotalCount(formatHexToInt(data.contracts.totalCount));
        setRows(data.contracts.edges);
        setPageInfo(data.contracts.pageInfo);
        setPerPage(25);
      }
    },
    [loading]
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-baseline bg-gray-200 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
        <div className="text-black  dark:text-gray-300 md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          Contracts
        </div>
        <div className="text-black  dark:text-gray-300 text-sm">
          Home {">"} Contracts
        </div>
      </div>
      {rows &&
        <components.TableView
          classes="w-screen max-w-6xl"
          title="Contracts"
          columns={columns}
          loading={loading}
          isCustomPagination={true}
          data={rows}
          totalCount={totalCount}
          pageInfo={pageInfo}
          fetchMoreData={fetchMoreData}
        />}
    </div>
  );
}
