import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import components from 'components'
import { formatHexToInt, formatHash } from 'utils'
import moment from 'moment'

const GET_CONTRACTS = gql`
  query ContractList($cursor: Cursor, $count: Int!) {
    contracts(cursor: $cursor, count: $count) {
      totalCount
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      edges {
        contract {
          address
          deployedBy {
            hash
          }
          transactionHash
          name
          version
          compiler
          validated
          timestamp
        }
        cursor
      }
    }
  }
`

export default function Contracts() {
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const count = 40
  const { loading, error, data, fetchMore } = useQuery(GET_CONTRACTS, {
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

    fetchMoreResult.contracts.edges = [
      ...previousResult.contracts.edges,
      ...fetchMoreResult.contracts.edges,
    ]
    setRows(rows.concat(fetchMoreResult.contracts.edges))
    return { ...fetchMoreResult }
  }

  const fetchMoreData = () => {
    if (data && fetchMore) {
      const nextPage = getHasNextPage(data.contracts)
      const after = getAfter(data.contracts)
      if (nextPage && after !== null) {
        fetchMore({ updateQuery, variables: { cursor: after, count: count } })
      }
    }
  }
  useEffect(() => {
    if (data) {
      setTotalCount(formatHexToInt(data.contracts.totalCount))
      setRows(data.contracts.edges)
    }
  }, [data])

  const columns = [
    'Address',
    'Name',
    'Compiler',
    'Version',
    'Validated',
    'Time',
  ]
  return (
    <components.TableView classes="w-screen max-w-5xl" title="Contracts">
      <div className="flex flex-col justify-between px-2 py-5">
        <div>
          More than {'>'} {formatHexToInt(data?.contracts.totalCount)} contracts
          found
        </div>
        <div className="text-sm text-gray-500">
          Showing last {rows?.length} contracts
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
          to={`/address/${item.contract.address}`}
        >
          {formatHash(item.contract.address)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {item.contract.name}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {item.contract.compiler}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {formatHexToInt(item.contract.version)}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <span className="text-sm">{item.contract.validated}</span>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {moment.unix(item.contract.timestamp).format('MM/DD/yyyy')}
        </div>
      </td>
    </tr>
  )
}
