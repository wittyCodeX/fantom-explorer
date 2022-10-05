import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import components from "components";
import {
  formatHexToInt,
  numToFixed,
  timestampToDate,
  WEIToFTM,
  formatDate
} from "utils";
import moment from "moment";

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
      <span className="text-sm">
        {numToFixed(WEIToFTM(formatHexToInt(row.epoch.epochFee)), 2)} FTM
      </span>,
    right: true
  }
];

export default function Epochs() {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const count = 40;
  const { loading, error, data, fetchMore } = useQuery(GET_EPOCHS, {
    variables: {
      cursor: null,
      count: count
    }
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
    setRows(fetchMoreResult.epochs.edges);
    return { ...fetchMoreResult };
  };

  const fetchMoreData = (cursor, size = 25) => {
    if (data && fetchMore) {
      fetchMore({ updateQuery, variables: { cursor: cursor, count: size } });
    }
  };
  useEffect(
    () => {
      if (data) {
        setTotalCount(formatHexToInt(data.epochs.totalCount));
        setRows(data.epochs.edges);
      }
    },
    [loading]
  );

  return (
    <div className="flex flex-col">
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
