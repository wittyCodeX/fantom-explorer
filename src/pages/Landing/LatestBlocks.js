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
    <tr className="">
      <td className="md:px-2 text-sm truncate py-3 w-screen">
        <div className="flex flex-row justify-between">
          <div className="col-sm-4">
            <div className="flex flex-row align-items-sm-center mr-4 mb-1 mb-sm-0">
              <div className="sm:flex mr-2">
                <span className="flex rounded-full bg-gray-200 w-12 h-12 items-center justify-center">
                  <span className="scroll-row-icon-text font-size-1 font-weight-500 fontfamily-1">
                    Bk
                  </span>
                </span>
              </div>
              <div className="flex flex-col">
                <Link
                  to={`/blocks/${formatHexToInt(item.block.number)}`}
                  className="text-blue-500 dark:text-gray-300"
                >
                  #{formatHexToInt(item.block.number)}
                </Link>
                <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  {moment.unix(item.block.timestamp).fromNow()}
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-8  hidden sm:hidden md:block">
            <div className="flex justify-between gap-4">
              <div className="flex flex-col">
                <span className="d-block mb-1 mb-sm-0">
                  TxHash:
                  <Link
                    className="text-blue-500 dark:text-gray-300"
                    to={`/transactions/${item.block.hash}`}
                  >
                    {" "}{formatHash(item.block.hash)}
                  </Link>
                </span>
                <div>
                  <span>
                    {item.block.transactionCount} txns{" "}
                  </span>
                  <span className="small text-secondary">
                    {moment
                      .unix(item.block.timestamp)
                      .format("MM.DD.YYYY, hh:mm:ss")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="bg-gray-100 h-8 font-weight-500 text-sm p-2 rounded">
              {formatHexToInt(item.block.gasUsed)}
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
};
