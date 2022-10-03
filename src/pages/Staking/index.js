import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import components from 'components'
import { formatHexToInt, timestampToDate, formatDate } from 'utils'
import moment from 'moment'
import { ethers } from 'ethers'

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
`

export default function Staking() {
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const count = 40
  const { loading, error, data, fetchMore } = useQuery(GET_BLOCKS, {
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

    fetchMoreResult.blocks.edges = [
      ...previousResult.blocks.edges,
      ...fetchMoreResult.blocks.edges,
    ]
    setRows(rows.concat(fetchMoreResult.blocks.edges))
    return { ...fetchMoreResult }
  }

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.blocks)
      const after = getAfter(data.blocks)
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } })
      }
    }
  }
  useEffect(() => {
    if (data) {
      setTotalCount(formatHexToInt(data.blocks.totalCount))
      setRows(data.blocks.edges)
    }
  }, [data])

  const columns = ['Block', 'Time', 'Age', 'Txn', 'Gas Used']
  return (
    <components.TableView classes="w-screen max-w-5xl" title="Blocks">
      <div className="flex flex-col justify-between px-2 py-5">
        <div>
          More than {'>'} {formatHexToInt(data?.blocks.totalCount)} blocks found
        </div>
        <div className="text-sm text-gray-500">
          Showing last {rows?.length} blocks
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
          to={`/blocks/${formatHexToInt(item.block.number)}`}
        >
          {' '}
          {formatHexToInt(item.block.number)}
        </Link>
      </td>{' '}
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {formatDate(timestampToDate(item.block.timestamp).toString())}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {moment.unix(item.block.timestamp).fromNow()}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <span className="text-sm">
          {formatHexToInt(item.block.transactionCount)}
        </span>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <span className="text-sm">{formatHexToInt(item.block.gasUsed)}</span>
      </td>
    </tr>
  )
}
