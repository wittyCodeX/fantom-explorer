import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import components from 'components'
import { formatHexToInt, formatHash, numToFixed } from 'utils'
import moment from 'moment'
import { ethers } from 'ethers'

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
          tokenTransactions {
            trxIndex
            tokenAddress
            tokenName
            tokenSymbol
            tokenType
            tokenId
            tokenDecimals
            type
            sender
            recipient
            amount
          }
        }
      }
    }
  }
`

export default function Transactions() {
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const count = 40
  const { loading, error, data, fetchMore } = useQuery(GET_TRANSACTIONS, {
    variables: {
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

    fetchMoreResult.transactions.edges = [
      ...previousResult.transactions.edges,
      ...fetchMoreResult.transactions.edges,
    ]
    setRows(rows.concat(fetchMoreResult.transactions.edges))
    return { ...fetchMoreResult }
  }

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.transactions)
      const after = getAfter(data.transactions)
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } })
      }
    }
  }
  useEffect(() => {
    if (data) {
      setTotalCount(formatHexToInt(data.transactions.totalCount))
      setRows(data.transactions.edges)
    }
  }, [data])

  const columns = ['Tx Hash', 'Block', 'Time', 'From', 'To', 'Value', 'Txn Fee']
  return (
    <components.TableView classes="w-screen max-w-5xl" title="Transactions">
      <div className="flex flex-col justify-between px-2 py-5">
        <div>
          More than {'>'} {formatHexToInt(data?.transactions.totalCount)}{' '}
          transactions found
        </div>
        <div className="text-sm text-gray-500">
          Showing last {rows?.length} transactions
        </div>
      </div>
      <InfiniteScroll
        dataLength={totalCount}
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
            rows &&
            rows.map((item, index) => (
              <DynamicTableRow item={item} key={index} />
            ))
          )}
        </components.DynamicTable>
      </InfiniteScroll>
    </components.TableView>
  )
}
const DynamicTableRow = ({ item }) => {
  return (
    <tr>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500"
          to={`/transactions/${item.transaction.hash}`}
        >
          {' '}
          {formatHash(item.transaction.hash)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          to={`/blocks/${formatHexToInt(item.transaction.block.number)}`}
          className="text-blue-500"
        >
          #{formatHexToInt(item.transaction.block.number)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {moment.unix(item.transaction.block.timestamp).fromNow()}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500"
          to={`/address/${item.transaction.from}`}
        >
          {' '}
          {formatHash(item.transaction.from)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link className="text-blue-500" to={`/address/${item.transaction.to}`}>
          {' '}
          {formatHash(item.transaction.to)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {numToFixed(ethers.utils.formatEther(item.transaction.value), 2)} FTM
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <span className="text-sm">
          {formatHexToInt(item.transaction.gasUsed)}
        </span>
      </td>
    </tr>
  )
}
