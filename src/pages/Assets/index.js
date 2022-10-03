import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import { formatHexToInt, timestampToDate, formatDate } from "utils";
import moment from "moment";
import ERC20TokenList from "./ERC20TokenList";
import FantomAssets from "./FantomAssets";
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

export default function Assets() {
  const [rows, setRows] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(1);

  const [totalCount, setTotalCount] = useState(0);
  const count = 40;
  const { loading, error, data, fetchMore } = useQuery(GET_BLOCKS, {
    variables: {
      cursor: null,
      count: count
    }
  });

  const getHasNextPage = data => data.pageInfo.hasNext;

  const getAfter = data =>
    data.edges && data.edges.length > 0
      ? data.edges[data.edges.length - 1].cursor
      : null;

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }

    fetchMoreResult.blocks.edges = [
      ...previousResult.blocks.edges,
      ...fetchMoreResult.blocks.edges
    ];
    setRows(rows.concat(fetchMoreResult.blocks.edges));
    return { ...fetchMoreResult };
  };

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.blocks);
      const after = getAfter(data.blocks);
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } });
      }
    }
  };
  useEffect(
    () => {
      if (data) {
        setTotalCount(formatHexToInt(data.blocks.totalCount));
        setRows(data.blocks.edges);
      }
    },
    [data]
  );

  const columns = ["Block", "Time", "Age", "Txn", "Gas Used"];
  return (
    <components.TableView classes="w-screen max-w-5xl" title="Assets">
      <div className="bg-white text-gray-600 p-2">
        <div className="flex space-x-3 border-b">
          {/* Loop through tab data and render button for each. */}
          <button
            className={`p-2 border-b-4 transition-colors duration-300 ${1 ===
            activeTabIndex
              ? "border-teal-500"
              : "border-transparent hover:border-gray-200"}`}
            onClick={() => setActiveTabIndex(1) // Change the active tab on click.
            }
          >
            Fantom Finance Assets
          </button>
          <button
            className={`p-2 border-b-4 transition-colors duration-300 ${2 ===
            activeTabIndex
              ? "border-teal-500"
              : "border-transparent hover:border-gray-200"}`}
            onClick={() => setActiveTabIndex(2) // Change the active tab on click.
            }
          >
            All ERC20 Tokens
          </button>
        </div>
        {/* Show active tab content. */}
        <div className="py-4">
          {data && activeTabIndex === 1
            ? <FantomAssets />
            : activeTabIndex === 2 ? <ERC20TokenList /> : ""}
        </div>
      </div>
    </components.TableView>
  );
}
