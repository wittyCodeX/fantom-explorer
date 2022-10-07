import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import {
  formatHexToInt,
  numToFixed,
  timestampToDate,
  WEIToFTM,
  formatDate
} from "utils";

const GET_EPOCHS = gql`
  query EpochList($cursor: Cursor, $count: Int!) {
    epochs(cursor: $cursor, count: $count) {
      totalCount
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      edges {
        epoch {
          id
          endTime
          epochFee
        }
        cursor
      }
    }
  }
`;
const columns = [
  {
    name: "Epoch",
    selector: row => row.epoch.id,
    cell: row =>
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/epochs/${formatHexToInt(row.epoch.id)}`}
      >
        {" "}{formatHexToInt(row.epoch.id)}
      </Link>,
    sortable: true
  },
  {
    name: "End Time",
    selector: row => row.epoch.endTime,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {formatDate(timestampToDate(row.epoch.endTime).toString())}
      </span>,
    grow: 1
  },
  {
    name: "Total Fee (FTM)",
    selector: row => row.epoch.epochFee,
    cell: row =>
      <span className="text-sm text-black dark:text-gray-300">
        {numToFixed(WEIToFTM(formatHexToInt(row.epoch.epochFee)), 2)} FTM
      </span>,
    right: true
  }
];

export default function Epochs() {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const { loading, error, data, fetchMore } = useQuery(GET_EPOCHS, {
    variables: {
      cursor: null,
      count: perPage
    }
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
    setRows(fetchMoreResult.epochs.edges);
    return { ...fetchMoreResult };
  };

  const fetchMoreData = (cursor, size = perPage) => {
    if (data && fetchMore) {
      fetchMore({ updateQuery, variables: { cursor: cursor, count: size } });
    }
  };
  useEffect(
    () => {
      if (data) {
        setTotalCount(formatHexToInt(data.epochs.totalCount));
        setPerPage(25);
        setRows(data.epochs.edges);
      }
    },
    [loading]
  );

  return (
    <div className="flex flex-col w-screen max-w-6xl">
      <div className="flex flex-row justify-between items-baseline bg-gray-200 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
        <div className="text-black  dark:text-gray-300 md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          Epochs
        </div>
        <div className="text-black  dark:text-gray-300 text-sm">
          Home {">"} Epochs
        </div>
      </div>
      {rows &&
        <components.TableView
          classes="w-screen max-w-6xl"
          title="Epochs"
          columns={columns}
          loading={loading}
          data={rows}
          totalCount={totalCount}
          fetchMoreData={fetchMoreData}
        />}
    </div>
  );
}
