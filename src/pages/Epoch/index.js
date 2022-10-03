import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import components from 'components'
import {
  formatHexToInt,
  numToFixed,
  timestampToDate,
  WEIToFTM,
  formatDate,
} from 'utils'
import moment from 'moment'

const GET_EPOCHS = gql`
  query EpochList($cursor: Cursor, $count: Int!) {
    epochs(cursor: $cursor, count: $count) {
      totalCount
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      edges {
        epoch {
          id
          endTime
          epochFee
        }
        cursor
      }
    }
  }
`

export default function Epochs() {
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const count = 40
  const { loading, error, data, fetchMore } = useQuery(GET_EPOCHS, {
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

    fetchMoreResult.epochs.edges = [
      ...previousResult.epochs.edges,
      ...fetchMoreResult.epochs.edges,
    ]
    setRows(rows.concat(fetchMoreResult.epochs.edges))
    return { ...fetchMoreResult }
  }

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.epochs)
      const after = getAfter(data.epochs)
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } })
      }
    }
  }
  useEffect(() => {
    if (data) {
      setTotalCount(formatHexToInt(data.epochs.totalCount))
      setRows(data.epochs.edges)
    }
  }, [data])

  const columns = ['Epoch', 'End Time', 'Total Fee (FTM)']
  return (
    <components.TableView classes="w-screen max-w-5xl" title="epochs">
      <div className="flex flex-col justify-between px-2 py-5">
        <div>
          More than {'>'} {formatHexToInt(data?.epochs.totalCount)} epochs found
        </div>
        <div className="text-sm text-gray-500">
          Showing last {rows?.length} epochs
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
          to={`/epochs/${formatHexToInt(item.epoch.id)}`}
        >
          {' '}
          {formatHexToInt(item.epoch.id)}
        </Link>
      </td>{' '}
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-epoch small text-secondary ml-1 ml-sm-0 text-nowrap">
          {formatDate(timestampToDate(item.epoch.endTime).toString())}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3 flex justify-center">
        <span className="text-sm">
          {numToFixed(WEIToFTM(formatHexToInt(item.epoch.epochFee)), 2)} FTM
        </span>
      </td>
    </tr>
  )
}
