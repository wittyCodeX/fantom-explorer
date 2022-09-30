import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useQuery, gql } from '@apollo/client'
import components from 'components'
import { Link } from 'react-router-dom'
import { formatHash, formatHexToInt, numToFixed, WEIToFTM } from 'utils'
import moment from 'moment'

const GET_ERC20TRANSACTIONS = gql`
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
`
export default function ERC721TransactionList({ address, setTotal }) {
  const [block, setBlock] = useState([])
  const count = 20
  const columns = [
    'Tx Hash',
    'Method',
    'Time',
    'From',
    'To',
    'Value',
    'Token ID',
  ]

  const { loading, error, data, fetchMore } = useQuery(GET_ERC20TRANSACTIONS, {
    variables: {
      address: address,
      cursor: null,
      count: count,
    },
  })

  const getHasNextPage = (data) => data.pageInfo.hasNext

  const getAfter = (data) =>
    data.edges && data.edges.length > 0
      ? data.edges[data.edges.length - 1].cursor
      : null

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult
    }

    fetchMoreResult.account.erc721TxList.edges = [
      ...previousResult.account.erc721TxList.edges,
      ...fetchMoreResult.account.erc721TxList.edges,
    ]
    setBlock(fetchMoreResult.account)
    return { ...fetchMoreResult }
  }

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.account.erc721TxList)
      const after = getAfter(data.account.erc721TxList)
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } })
      }
    }
  }

  useEffect(() => {
    if (data) {
      setTotal(data.account.erc721TxList.totalCount)
      const account = data.account
      setBlock(account)
    }
  }, [data])
  return (
    <InfiniteScroll
      dataLength={formatHexToInt(data?.account.erc721TxList.totalCount)}
      next={fetchMoreData}
      hasMore={true}
      loader={<div className="text-center">Loading More...</div>}
    >
      <components.DynamicTable columns={columns}>
        {loading ? (
          <tr>
            <td colSpan={columns?.length}>
              <components.Loading />
            </td>
          </tr>
        ) : (
          block &&
          block.erc721TxList?.edges.map((item, index) => (
            <DynamicTableRow item={item} key={index} />
          ))
        )}
      </components.DynamicTable>
    </InfiniteScroll>
  )
}

const DynamicTableRow = ({ item }) => {
  return (
    <tr>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500"
          to={`/transactions/${item.trx.trxHash}`}
        >
          {' '}
          {formatHash(item.trx.trxHash)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">{item.trx.trxType}</td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {moment.unix(item.trx.timeStamp).fromNow()}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link className="text-blue-500" to={`/address/${item.trx.sender}`}>
          {' '}
          {formatHash(item.trx.sender)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link className="text-blue-500" to={`/address/${item.trx.recipient}`}>
          {' '}
          {formatHash(item.trx.recipient)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {numToFixed(WEIToFTM(item.trx.amount), 2)} FTM
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <span className="text-sm">{item.trx.tokenId}</span>
      </td>
    </tr>
  )
}
