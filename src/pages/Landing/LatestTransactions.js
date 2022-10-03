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
      count: 7,
    },
    pollInterval: 3000,
  });

  useEffect(async () => {
    if (data) {
      const edges = data.transactions.edges;
      setTransactions(edges);

      let transactions = [];
      const api = services.provider.buildAPI();

      for (let i = 0; i < edges.length; i++) {
        let edgeNew;

        let addressFrom;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            edges[i].transaction.from
          );
          addressFrom = clients.utils.decodeNameHashInputSignals(nameHash);
        } catch {
          addressFrom = edges[i].transaction.from;
        }
        let addressTo;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            edges[i].transaction.to
          );
          addressTo = clients.utils.decodeNameHashInputSignals(nameHash);
        } catch {
          addressTo = edges[i].transaction.to;
        }

        edgeNew = {
          cursor: edges[i].cursor,
          transaction: {
            from: addressFrom,
            to: addressTo,
            hash: edges[i].transaction.hash,
            value: edges[i].transaction.value,
            gasUsed: edges[i].transaction.gasUsed,
            block: {
              number: edges[i].transaction.block.number,
              timestamp: edges[i].transaction.block.timestamp,
            },
          },
        };

        transactions.push(edgeNew);
      }
      setTransactions(transactions);
    }
  }, [data]);
  return (
    <components.Panel
      classes="max-h-96 h-96"
      title="Latest Transactions"
      btnLabel="View all transactions"
      to="/transactions"
    >
      {transactions.length > 0 ? (
        <components.DynamicTable>
          {transactions.map((item, index) => (
            <DynamicTableRow
              classes={loading ? "animate-pulse" : ""}
              item={item}
              key={index}
            />
          ))}
        </components.DynamicTable>
      ) : (
        <components.Loading />
      )}
    </components.Panel>
  );
}

const DynamicTableRow = (props) => {
  const item = props.item;
  return (
    <tr className="border-b border-gray-lighter dark:border-blue-lighter">
      <td className="md:px-2 truncate py-3 w-screen">
        <div className="flex flex-col">
          <div className="flex flex-row  mb-1">
            <div className="flex w-2/5">TX Hash </div>
            <Link
              to={`/transactions/${item.transaction.hash}`}
              className="text-blue-500 dark:text-gray-300"
            >
              {formatHash(item.transaction.hash)}
            </Link>
          </div>
          <div className="flex flex-row  mb-1">
            <div className="flex w-2/5">Time </div>
            <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
              {moment.unix(item.transaction.block.timestamp).fromNow()}
            </div>
          </div>
          <div className="flex flex-row  mb-1">
            <div className="flex w-2/5">From </div>
            <Link
              className="text-blue-500 dark:text-gray-300"
              to={`/address/${item.transaction.from}`}
            >
              {" "}
              {getTypeByStr(item.transaction.from) == 'address'? formatHash(item.transaction.from): item.transaction.from}
            </Link>
          </div>
          <div className="flex flex-row  mb-1">
            <div className="flex w-2/5">To </div>
            <Link
              className="text-blue-500 dark:text-gray-300"
              to={`/address/${item.transaction.to}`}
            >
              {" "}
              {getTypeByStr(item.transaction.to) == 'address'? formatHash(item.transaction.to): item.transaction.to}
            </Link>
          </div>
          <div className="flex flex-row  mb-1">
            <div className="flex w-2/5">Amount {`(FTM)`} </div>
            <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
              {numToFixed(WEIToFTM(item.transaction.value), 4)} FTM
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};
