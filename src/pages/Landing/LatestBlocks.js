import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { formatHexToInt, formatHash } from "utils";
import { Link } from "react-router-dom";
import moment from "moment";
import components from "components";

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
export default function LatestBlocks() {
  const [blocks, setBlocks] = useState([]);
  const { loading, error, data } = useQuery(GET_BLOCKS, {
    variables: {
      cursor: null,
      count: 7
    },
    pollInterval: 3000
  });
  useEffect(
    () => {
      if (data) {
        const edges = data.blocks.edges;
        setBlocks(edges);
      }
    },
    [data]
  );

  return (
    <components.Panel
      classes="max-h-96 h-96"
      title="Latest Blocks"
      btnLabel="View all blocks"
      to="/blocks"
    >
      {loading
        ? <components.Loading />
        : <components.DynamicTable>
            {blocks &&
              blocks.map((item, index) =>
                <DynamicTableRow item={item} key={index} />
              )}
          </components.DynamicTable>}
    </components.Panel>
  );
}

const DynamicTableRow = ({ item }) => {
  return (
    <tr className="border-b border-gray-lighter dark:border-blue-lighter">
      <td className="md:px-2 truncate py-3 w-screen">
        <div className="flex flex-col">
          <div className="flex flex-row  mb-1">
            <div className="flex w-2/5">Block </div>
            <Link
              to={`/blocks/${formatHexToInt(item.block.number)}`}
              className="text-blue-500 dark:text-gray-300"
            >
              {formatHexToInt(item.block.number)}
            </Link>
          </div>
          <div className="flex flex-row  mb-1">
            <div className="flex w-2/5">Age </div>
            <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
              {moment.unix(item.block.timestamp).fromNow()}
            </div>
          </div>
          <div className="flex flex-row  mb-1">
            <div className="flex w-2/5">Txns </div>
            <span>
              {item.block.transactionCount} txns{" "}
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
};
