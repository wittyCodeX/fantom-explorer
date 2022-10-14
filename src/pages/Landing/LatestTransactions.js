import React, { useEffect, useState } from "react";
import components from "components";
import { useQuery, gql } from "@apollo/client";
import { formatHash, numToFixed, WEIToFTM, getTypeByStr } from "utils";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import moment from "moment";
import services from "services";
import clients from "clients";

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
        }
      }
    }
  }
`;
export default function LatestTransactions() {
  const [transactions, setTransactions] = useState([]);
  const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
    variables: {
      cursor: null,
      count: 10
    },
    pollInterval: 3000
  });

  useEffect(
    async () => {
      if (data) {
        const edges = data.transactions.edges;
        setTransactions(edges);

        // let transactions = [];
        // const api = services.provider.buildAPI();

        // for (let i = 0; i < edges.length; i++) {
        //   let edgeNew;

        //   let addressFrom;
        //   try {
        //     const nameHash = await api.contracts.EVMReverseResolverV1.get(
        //       edges[i].transaction.from
        //     );
        //     const nameSignal = await api.contracts.RainbowTableV1.lookup(
        //       nameHash.name
        //     );
        //     addressFrom = await clients.utils.decodeNameHashInputSignals(
        //       nameSignal
        //     );
        //   } catch {
        //     addressFrom = edges[i].transaction.from;
        //   }
        //   let addressTo;
        //   try {
        //     const nameHash = await api.contracts.EVMReverseResolverV1.get(
        //       edges[i].transaction.to
        //     );
        //     const nameSignal = await api.contracts.RainbowTableV1.lookup(
        //       nameHash.name
        //     );
        //     addressTo = await clients.utils.decodeNameHashInputSignals(
        //       nameSignal
        //     );
        //   } catch {
        //     addressTo = edges[i].transaction.to;
        //   }

        //   edgeNew = {
        //     cursor: edges[i].cursor,
        //     transaction: {
        //       from: addressFrom,
        //       to: addressTo,
        //       hash: edges[i].transaction.hash,
        //       value: edges[i].transaction.value,
        //       gasUsed: edges[i].transaction.gasUsed,
        //       block: {
        //         number: edges[i].transaction.block.number,
        //         timestamp: edges[i].transaction.block.timestamp,
        //       },
        //     },
        //   };

        //   transactions.push(edgeNew);
        // }
        // setTransactions(transactions);
      }
    },
    [data]
  );
  return (
    <components.Panel
      classes="max-h-[600px] h-[600px] sm:h-[400px] sm:max-h-[400px] lg:max-h-[600px] lg:h-[600px]"
      title="Latest Transactions"
      btnLabel="View all"
      to="/transactions"
      icon={services.linking.static("images/transfer.svg")}
    >
      {transactions.length > 0
        ? <components.DynamicTable>
            {transactions.map((item, index) =>
              <DynamicTableRow
                classes={loading ? "animate-pulse" : ""}
                item={item}
                key={index}
              />
            )}
          </components.DynamicTable>
        : <components.Loading />}
    </components.Panel>
  );
}

const DynamicTableRow = props => {
  const item = props.item;
  return (
    <tr className="border-b border-gray-300 dark:border-[#2c3e6f]">
      <td className="md:px-2 truncate py-3 w-screen">
        <div className="flex flex-row items-center justify-between text-lg">
          <div className="flex flex-col">
            <div className="flex flex-row items-center mb-1">
              <div className="flex mx-2 text-sm">Txn Hash# </div>
              <Link
                to={`/tx/${item.transaction.hash}`}
                className="text-blue-500"
              >
                {formatHash(item.transaction.hash)}
              </Link>
            </div>
            <div className="flex flex-row  text-sm  mx-2">
              <div className="flex mr-2">From </div>
              <Link
                className="text-blue-500"
                to={`/address/${item.transaction.from}`}
              >
                {" "}{getTypeByStr(item.transaction.from) == "address"
                  ? formatHash(item.transaction.from)
                  : item.transaction.from}
              </Link>
              <div className="flex mx-2">To </div>
              <Link
                className="text-blue-500 dark:text-gray-300"
                to={`/address/${item.transaction.to}`}
              >
                {" "}{getTypeByStr(item.transaction.to) == "address"
                  ? formatHash(item.transaction.to)
                  : item.transaction.to}
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-end  mb-1">
            <div className="text-sm flex flex-row items-center text-red-500 dark:text-gray-100 font-semibold text-nowrap">
              {numToFixed(WEIToFTM(item.transaction.value), 4)} FTM
              <img
                src={services.linking.static("images/check.svg")}
                alt="status"
                srcSet=""
                className="w-5 h-5 mx-2"
              />
            </div>
            <div className="text-sm">
              {moment.unix(item.transaction.block.timestamp).fromNow()}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};
