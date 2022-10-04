import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import {
  formatHash,
  formatHexToInt,
  formatIntToHex,
  timestampToDate,
  numToFixed,
  isObjectEmpty,
  formatDate,
} from "utils";
import moment from "moment";
import { ethers } from "ethers";
import services from "services";

const GET_BLOCK = gql`
  query BlockByNumber($number: Long) {
    block(number: $number) {
      number
      transactionCount
      hash
      parent {
        hash
      }
      timestamp
      txList {
        hash
        from
        to
        value
        gasUsed
        block {
          number
          timestamp
        }
      }
    }
  }
`;
export default function BlockDetail() {
  const params = useParams();
  const [block, setBlock] = useState([]);
  const { loading, error, data } = useQuery(GET_BLOCK, {
    variables: {
      number: formatIntToHex(params.id),
    },
  });

  const columns = [
    "Tx Hash",
    "Block",
    "Time",
    "From",
    "To",
    "Value",
    "Txn Fee",
  ];

  useEffect(async () => {
    if (data) {
      const edges = data.block;
      let newBlockData;
      let transactions = [];
      const api = services.provider.buildAPI();

      for (let i = 0; i < edges.txList.length; i++) {
        let edgeNew;

        let addressFrom;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            edges.txList[i].from
          );
          const nameSignal = await api.contracts.RainbowTableV1.lookup(
            nameHash.name
          );
          addressFrom = await clients.utils.decodeNameHashInputSignals(
            nameSignal
          );
        } catch {
          addressFrom = edges.txList[i].from;
        }
        let addressTo;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            edges.txList[i].to
          );
          const nameSignal = await api.contracts.RainbowTableV1.lookup(
            nameHash.name
          );
          addressTo = await clients.utils.decodeNameHashInputSignals(
            nameSignal
          );
        } catch {
          addressTo = edges.txList[i].to;
        }

        edgeNew = {
          from: addressFrom,
          to: addressTo,
          hash: edges.txList[i].hash,
          value: edges.txList[i].value,
          gasUsed: edges.txList[i].gasUsed,
          block: {
            number: edges.txList[i].block.number,
            timestamp: edges.txList[i].block.timestamp,
          },
        };
        transactions.push(edgeNew);
      }
      newBlockData = {
        number: edges.number,
        transactionCount: edges.transactionCount,
        hash: edges.hash,
        parent: {
          hash: edges.parent.hash,
        },
        timestamp: edges.timestamp,
        txList: [...transactions],
      };
      setBlock(newBlockData);
    }
  }, [data]);
  return (
    <div>
      <components.TableView
        classes="w-screen max-w-6xl"
        title={`Block #${formatHexToInt(block.number)}`}
        dontNeedSubtitle={true}
      >
        <components.DynamicTable>
          {isObjectEmpty(block) ? (
            <tr>
              <td>
                <components.Loading />
              </td>
            </tr>
          ) : (
            <>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Block Height:
                  </div>
                  <div className="col-span-2">
                    {formatHexToInt(block.number)}
                    <Link
                      className="bg-gray-200 text-blue-500 text-sm px-1 mx-1 font-extrabold"
                      to={`/blocks/${Number(formatHexToInt(block.number) - 1)}`}
                    >
                      {"<"}
                    </Link>
                    <Link
                      className="bg-gray-200 text-blue-500 text-sm px-1 font-extrabold"
                      to={`/blocks/${Number(formatHexToInt(block.number) + 1)}`}
                    >
                      {">"}
                    </Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Timestamp:
                  </div>
                  <div className="col-span-2">
                    {moment.unix(block.timestamp).fromNow()}{" "}
                    {`(${formatDate(timestampToDate(block.timestamp))})`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Transactions:
                  </div>
                  <div className="col-span-2">
                    {formatHexToInt(block.transactionCount)} transactions
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Block Hash:
                  </div>
                  <div className="col-span-2  break-words">{block.hash}</div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Parent Hash:
                  </div>
                  <div className="col-span-2  break-words">
                    {block.parent?.hash}
                  </div>
                </td>
              </tr>
            </>
          )}
        </components.DynamicTable>
      </components.TableView>

      <components.TableView
        classes="w-screen max-w-6xl"
        title={`Transactions (${block.txList?.length})`}
        dontNeedSubtitle={true}
      >
        <components.DynamicTable columns={columns}>
          {loading ? (
            <tr>
              <td colSpan={columns?.length}>
                <components.Loading />
              </td>
            </tr>
          ) : (
            block.txList &&
            block.txList.map((item, index) => (
              <DynamicTableRow item={item} key={index} />
            ))
          )}
        </components.DynamicTable>
      </components.TableView>
    </div>
  );
}
const DynamicTableRow = ({ item }) => {
  return (
    <tr>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500 dark:text-gray-300"
          to={`/transactions/${item.hash}`}
        >
          {" "}
          {formatHash(item.hash)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          to={`/blocks/${formatHexToInt(item.block.number)}`}
          className="text-blue-500 dark:text-gray-300"
        >
          #{formatHexToInt(item.block.number)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {moment.unix(item.block.timestamp).fromNow()}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500 dark:text-gray-300"
          to={`/address/${item.from}`}
        >
          {" "}
          {formatHash(item.from)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500 dark:text-gray-300"
          to={`/address/${item.to}`}
        >
          {" "}
          {formatHash(item.to)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {numToFixed(ethers.utils.formatEther(item.value), 2)} FTM
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <span className="text-sm">{formatHexToInt(item.gasUsed)}</span>
      </td>
    </tr>
  );
};
