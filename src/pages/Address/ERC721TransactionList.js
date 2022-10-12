import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import services from "services";
import { formatHash, isObjectEmpty, addressToDomain, numToFixed, WEIToFTM, formatHexToInt } from "utils";
import moment from "moment";

const GET_ERC721TRANSACTIONS = gql`
  query GetERC721Transactions(
    $address: Address!
    $cursor: Cursor
    $count: Int!
  ) {
    account(address: $address) {
      address
      erc721TxList(cursor: $cursor, count: $count) {
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
            tokenId
            trxType
            token {
              address
              name
              symbol
            }
          }
        }
      }
    }
  }
`;

const columns = [
  {
    name: "Txn Hash",
    selector: (row) => row.trx.trxHash,
    cell: (row) => (
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/tx/${row.trx.trxHash}`}
      >
        {" "}
        {formatHash(row.trx.trxHash)}
      </Link>
    ),
    grow: 2,
  },
  {
    name: "Method",
    selector: (row) => row.trx.trxType,
    cell: (row) => (
      <span className="text-black dark:text-gray-300 bg-gray-200 dark:bg-[#2c2e3f] p-2">{row.trx.trxType}</span>
    ),
    sortable: true,

  },
  {
    name: "Time",
    selector: (row) => row.trx.timeStamp,
    cell: (row) => (
      <span className="text-black dark:text-gray-300">
        {moment.unix(row.trx.timeStamp).fromNow()}
      </span>
    ),
    sortable: true,
  },
  {
    name: "From",
    selector: (row) => row.trx.sender,
    cell: (row) => (
      <Link
        className="flex flex-row items-center justify-between gap-4 text-blue-500 dark:text-gray-300"
        to={`/address/${row.trx.sender}`}
      >
        {" "}
        {formatHash(row.trx.sender)}
        <img
          src={services.linking.static("images/arrow-right.svg")}
          alt="from"
          srcSet=""
          className="w-4"
        />
      </Link>
    ),
    grow: 2,
  },
  {
    name: "T0",
    selector: (row) => row.trx.recipient,
    cell: (row) => (
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/address/${row.trx.recipient}`}
      >
        {" "}
        {formatHash(row.trx.recipient)}
      </Link>
    ),
    grow: 2,
    sortable: true,
  },
  {
    name: "Value",
    selector: (row) => row.trx.amount,
    cell: (row) => (
      <span className="text-black dark:text-gray-300">
        {numToFixed(WEIToFTM(row.trx.amount), 2)} FTM
      </span>
    ),
    sortable: true,
    maxWidth: "250px",
  },
  {
    name: "Token ID",
    selector: (row) => row.trx.tokenId,
    cell: (row) => (
      <span className="text-sm text-black dark:text-gray-300 gap-2">
        {formatHexToInt(row.trx.tokenId)}
      </span>
    ),
    sortable: true,
  },
];
export default function ERC721TransactionList({ address, setTotal }) {
  const [block, setBlock] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [pageInfo, setPageInfo] = useState([]);

  const { loading, error, data, fetchMore } = useQuery(GET_ERC721TRANSACTIONS, {
    variables: {
      address: address,
      cursor: null,
      count: perPage,
    },
  });

  const updateQuery = async (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
    const account = fetchMoreResult.account;
    setBlock(account);
    await formatDomain(account);
    return { ...fetchMoreResult };
  };

  const fetchMoreData = (cursor, size = perPage) => {
    if (data && fetchMore) {
      fetchMore({ updateQuery, variables: { cursor: cursor, count: size } });
    }
  };

  useEffect(async () => {
    if (data) {
      const account = data.account;
      setTotal(account.erc721TxList.totalCount);
      setTotalCount(account.erc721TxList.totalCount);
      setPerPage(25);
      setPageInfo(account.erc721TxList.pageInfo);
      setBlock(account);
      await formatDomain(account);
    }
  }, [loading]);

  const formatDomain = async (data) => {
    let newAddressData = [];
    let formatedData = [];

    for (let i = 0; i < data.erc721TxList.edges.length; i++) {
      let edgeNew;

      const addressFrom = await addressToDomain(
        data.erc721TxList.edges[i].trx.sender
      );
      const addressTo = await addressToDomain(
        data.erc721TxList.edges[i].trx.recipient
      );
      edgeNew = {
        ...data.erc721TxList.edges[i],
        trx: {
          ...data.erc721TxList.edges[i].trx,
          sender: addressFrom,
          recipient: addressTo,
          token: {
            ...data.erc721TxList.edges[i].trx.token,
          },
        },
      };
      formatedData.push(edgeNew);
    }
    newAddressData = {
      ...data,
      erc721TxList: {
        pageInfo: {
          ...data.erc721TxList.pageInfo,
        },
        ...data.erc721TxList,
        edges: [...formatedData],
      },
    };
    setBlock(newAddressData);
  };

  return !isObjectEmpty(block) ? (
    <components.TableView
      classes="w-screen max-w-6xl"
      title="Transactions"
      columns={columns}
      loading={loading}
      data={block.erc721TxList?.edges}
      isCustomPagination={true}
      pageInfo={pageInfo}
      totalCount={totalCount}
      fetchMoreData={fetchMoreData}
    />
  ) : (
    <components.Loading />
  );
}
