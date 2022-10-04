import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { formatHexToInt, formatHash } from "utils";
import { Link } from "react-router-dom";
import moment from "moment";
import components from "components";
import services from "services";

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
      count: 10
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
      classes="max-h-[600px] h-[600px] sm:h-[400px] sm:max-h-[400px] lg:max-h-[600px] lg:h-[600px]"
      title="Latest Blocks"
      btnLabel="View all"
      to="/blocks"
      icon={services.linking.static("images/block-9.svg")}
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
    <tr className="border-b border-gray-300 dark:border-[#2c3e6f]">
      <td className="md:px-2 truncate py-3 w-screen">
        <div className="flex flex-row items-center justify-between text-lg">
          <div className="flex flex-col">
            <div className="flex flex-row items-center mb-1">
              <div className="flex mx-2 text-sm">Block# </div>
              <Link
                to={`/blocks/${formatHexToInt(item.block.number)}`}
                className="text-blue-500 dark:text-gray-300"
              >
                {formatHexToInt(item.block.number)}
              </Link>
            </div>
            <div className="flex flex-row  text-sm  mx-2">
              <span>
                include {item.block.transactionCount} txns{" "}
              </span>
            </div>
          </div>

          <div className="flex flex-row  mb-1">
            <div className="text-sm ml-1 ml-sm-0 text-nowrap">
              {moment.unix(item.block.timestamp).fromNow()}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};
