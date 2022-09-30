import React, { useEffect, useState } from 'react'
import components from 'components'
import { useQuery, gql } from '@apollo/client'
import { formatHash, numToFixed } from 'utils'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import moment from 'moment'

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
`
export default function LatestTransactions() {
  const [transactions, setTransactions] = useState([])
  const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
    variables: {
      cursor: null,
      count: 10,
    },
    pollInterval: 1000,
  })
  console.log(error)
  useEffect(() => {
    if (data) {
      const edges = data.transactions.edges
      setTransactions(edges)
    }
  }, [data])
  return (
    <components.Panel
      classes="max-h-96 h-96"
      title="Latest Transactions"
      btnLabel="View all transactions"
      to="/transactions"
    >
      <components.DynamicTable>
        {transactions &&
          transactions.map((item, index) => (
            <DynamicTableRow
              classes={loading ? 'animate-pulse' : ''}
              item={item}
              key={index}
            />
          ))}
      </components.DynamicTable>
    </components.Panel>
  )
}

const DynamicTableRow = (props) => {
  const item = props.item
  return (
    <tr className={`${props.classes ? props.classes : ''}`}>
      <td className="px-2 text-sm truncate py-3 w-screen">
        <div className="flex justify-between">
          <div className="col-sm-4">
            <div className="flex flex-row align-items-sm-center mr-4 mb-1 mb-sm-0">
              <div className="sm:flex mr-2">
                <span className="flex rounded-full bg-gray-200 w-12 h-12 items-center justify-center">
                  <span className="scroll-row-icon-text font-size-1 font-weight-500 fontfamily-1">
                    Tx
                  </span>
                </span>
              </div>
              <div className="flex flex-col">
                <Link
                  to={`/transactions/${item.transaction.hash}`}
                  className="text-blue-500"
                >
                  {formatHash(item.transaction.hash)}
                </Link>
                <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  {moment.unix(item.transaction.block.timestamp).fromNow()}
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-8 hidden sm:hidden md:block">
            <div className="flex justify-between gap-4">
              <div className="flex flex-col">
                <span className="d-block mb-1 mb-sm-0">
                  From:
                  <Link
                    className="text-blue-500"
                    to={`/address/${item.transaction.from}`}
                  >
                    {' '}
                    {formatHash(item.transaction.from)}
                  </Link>
                </span>
                <div>
                  To:
                  <Link
                    className="text-blue-500"
                    to={`/address/${item.transaction.to}`}
                  >
                    {' '}
                    {formatHash(item.transaction.to)}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <span className="bg-gray-100 h-8 font-weight-500 text-sm flex justify-center item-center p-2 rounded">
              {numToFixed(ethers.utils.formatEther(item.transaction.value), 4)}{' '}
              FTM
            </span>
          </div>
        </div>
      </td>
    </tr>
  )
}
