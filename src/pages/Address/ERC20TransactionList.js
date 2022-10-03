import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import DynamicTableRow from "./DynamicTableRow";

import { useQuery, gql } from "@apollo/client";
import { formatHexToInt, isObjectEmpty } from "utils";
import components from "components";
import services from "services";

const GET_ERC20TRANSACTIONS = gql`
  query GetERC20Transactions(
    $address: Address!
    $cursor: Cursor
    $count: Int!
  ) {
    account(address: $address) {
      address
      erc20TxList(cursor: $cursor, count: $count) {
        pageInfo {
          first
          last
          hasNext
          hasPrevious
        }
        totalCount
        edges {
          cursor
          trx {
            trxHash
            sender
            recipient
            amount
            timeStamp
            trxType
            token {
              address
              name
              symbol
              decimals
              logoURL
            }
          }
        }
      }
    }
  }
`;
export default function ERC20TransactionList({ address, setTotal }) {
  const [block, setBlock] = useState([]);
  const count = 20;
  const columns = ["Tx Hash", "Method", "Time", "From", "To", "Value", "Token"];

  const { loading, error, data, fetchMore } = useQuery(GET_ERC20TRANSACTIONS, {
    variables: {
      address: address,
      cursor: null,
      count: count,
    },
  });

  const getHasNextPage = (data) => data.pageInfo.hasNext;

  const getAfter = (data) =>
    data.edges && data.edges.length > 0
      ? data.edges[data.edges.length - 1].cursor
      : null;

  const updateQuery = async (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
    let transactions = [];
    const api = services.provider.buildAPI();

    const account = fetchMoreResult.account;

    for (let i = 0; i < account.erc20TxList.edges.length; i++) {
      let edgeNew;

      let senderFrom;
      try {
        const nameHash = await api.contracts.EVMReverseResolverV1.get(
          account.erc20TxList.edges[i].trx.sender
        );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        senderFrom = await clients.utils.decodeNameHashInputSignals(nameSignal);
      } catch {
        senderFrom = account.erc20TxList.edges[i].trx.sender;
      }
      let recipient;
      try {
        const nameHash = await api.contracts.EVMReverseResolverV1.get(
          account.erc20TxList.edges[i].trx.recipient
        );
        const nameSignal = await api.contracts.RainbowTableV1.lookup(
          nameHash.name
        );
        recipient = await clients.utils.decodeNameHashInputSignals(nameSignal);
      } catch {
        recipient = account.erc20TxList.edges[i].trx.recipient;
      }

      edgeNew = {
        cursor: account.erc20TxList.edges[i].cursor,
        trx: {
          sender: senderFrom,
          recipient: recipient,
          trxHash: account.erc20TxList.edges[i].trx.trxHash,
          amount: account.erc20TxList.edges[i].trx.amount,
          timeStamp: account.erc20TxList.edges[i].trx.timeStamp,
          trxType: account.erc20TxList.edges[i].trx.trxType,
          token: {
            address: account.erc20TxList.edges[i].trx.token.address,
            name: account.erc20TxList.edges[i].trx.token.name,
            symbol: account.erc20TxList.edges[i].trx.token.symbol,
            decimals: account.erc20TxList.edges[i].trx.token.decimals,
            logoURL: account.erc20TxList.edges[i].trx.token.logoURL,
          },
        },
      };
      transactions.push(edgeNew);
    }
    fetchMoreResult.account.erc20TxList.edges = [
      ...previousResult.account.erc20TxList.edges,
      ...transactions,
    ];

    setBlock(fetchMoreResult.account);
    return { ...fetchMoreResult };
  };

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.account.erc20TxList);
      const after = getAfter(data.account.erc20TxList);
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } });
      }
    }
  };

  useEffect(async () => {
    if (data) {
      setTotal(data.account.erc20TxList.totalCount);
      const account = data.account;
      setBlock(account);

      let newTransactionData;
      let transactions = [];
      const api = services.provider.buildAPI();

      for (let i = 0; i < account.erc20TxList.edges.length; i++) {
        let edgeNew;

        let senderFrom;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            account.erc20TxList.edges[i].trx.sender
          );
          const nameSignal = await api.contracts.RainbowTableV1.lookup(
            nameHash.name
          );
          senderFrom = await clients.utils.decodeNameHashInputSignals(
            nameSignal
          );
        } catch {
          senderFrom = account.erc20TxList.edges[i].trx.sender;
        }
        let recipient;
        try {
          const nameHash = await api.contracts.EVMReverseResolverV1.get(
            account.erc20TxList.edges[i].trx.recipient
          );
          const nameSignal = await api.contracts.RainbowTableV1.lookup(
            nameHash.name
          );
          recipient = await clients.utils.decodeNameHashInputSignals(
            nameSignal
          );
        } catch {
          recipient = account.erc20TxList.edges[i].trx.recipient;
        }

        edgeNew = {
          cursor: account.erc20TxList.edges[i].cursor,
          trx: {
            sender: senderFrom,
            recipient: recipient,
            trxHash: account.erc20TxList.edges[i].trx.trxHash,
            amount: account.erc20TxList.edges[i].trx.amount,
            timeStamp: account.erc20TxList.edges[i].trx.timeStamp,
            trxType: account.erc20TxList.edges[i].trx.trxType,
            token: {
              address: account.erc20TxList.edges[i].trx.token.address,
              name: account.erc20TxList.edges[i].trx.token.name,
              symbol: account.erc20TxList.edges[i].trx.token.symbol,
              decimals: account.erc20TxList.edges[i].trx.token.decimals,
              logoURL: account.erc20TxList.edges[i].trx.token.logoURL,
            },
          },
        };
        transactions.push(edgeNew);
      }
      newTransactionData = {
        address: account.address,
        erc20TxList: {
          totalCount: account.erc20TxList.totalCount,
          edges: [...transactions],
        },
      };
      setBlock(newTransactionData);
    }
  }, [data]);
  return (
    <InfiniteScroll
      dataLength={formatHexToInt(data?.account.erc20TxList.totalCount)}
      next={fetchMoreData}
      hasMore={true}
      loader={<div className="text-center">Loading More...</div>}
    >
      <div className="flex flex-col justify-between px-2 py-5">
        <div></div>
        <div className="text-sm text-gray-500">
          Showing last {block.erc20TxList?.edges.length} transactions
        </div>
      </div>
      <components.DynamicTable columns={columns}>
        {isObjectEmpty(block) ? (
          <tr>
            <td colSpan={columns?.length}>
              <components.Loading />
            </td>
          </tr>
        ) : (
          block &&
          block.erc20TxList?.edges.map((item, index) => (
            <DynamicTableRow item={item} key={index} />
          ))
        )}
      </components.DynamicTable>
    </InfiniteScroll>
  );
}
