import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import DynamicTableRow from './DynamicTableRow'

import { useQuery, gql } from '@apollo/client'
import { formatHexToInt } from 'utils'
import components from 'components'

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
`
export default function ERC20TransactionList({ address, setTotal }) {
  const [block, setBlock] = useState([])
  const count = 20
  const columns = ['Tx Hash', 'Method', 'Time', 'From', 'To', 'Value', 'Token']

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

    fetchMoreResult.account.erc20TxList.edges = [
      ...previousResult.account.erc20TxList.edges,
      ...fetchMoreResult.account.erc20TxList.edges,
    ]
    setBlock(fetchMoreResult.account)
    return { ...fetchMoreResult }
  }

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.account.erc20TxList)
      const after = getAfter(data.account.erc20TxList)
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } })
      }
    }
  }

  useEffect(() => {
    if (data) {
      setTotal(data.account.erc20TxList.totalCount)
      const account = data.account
      setBlock(account)
    }
  }, [data])
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
        {loading ? (
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
  )
}
