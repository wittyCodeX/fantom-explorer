import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import components from 'components'
import {
  formatHexToInt,
  formatIntToHex,
  timestampToDate,
  numToFixed,
  isObjectEmpty,
  WEIToFTM,
  formatNumberByLocale,
  formatDate,
} from 'utils'
import moment from 'moment'

const GET_EPOCH = gql`
  query EpochById($id: Long) {
    epoch(id: $id) {
      id
      endTime
      epochFee
      totalTxRewardWeight
      totalBaseRewardWeight
    }
  }
`
export default function EpochDetail() {
  const params = useParams()
  const [block, setBlock] = useState([])
  const { loading, error, data } = useQuery(GET_EPOCH, {
    variables: {
      id: formatIntToHex(params.id),
    },
  })

  useEffect(() => {
    if (data) {
      const epoch = data.epoch
      setBlock(epoch)
    }
  }, [data])
  return (
    <div>
      <components.TableView
        classes="w-screen max-w-5xl"
        title={`Epoch Detail`}
        dontNeedSubtitle={true}
      >
        <components.DynamicTable>
          {isObjectEmpty(block) ? (
            <tr>
              <td>
                <components.Loading />
              </td>
            </tr>
          ) : (
            <>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Epoch:
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold">
                      {formatHexToInt(block.id)}
                    </span>

                    <Link
                      className="bg-gray-200 text-blue-500 text-sm px-1 mx-1 font-extrabold"
                      to={`/epochs/${Number(formatHexToInt(block.id) - 1)}`}
                    >
                      {'<'}
                    </Link>
                    <Link
                      className="bg-gray-200 text-blue-500 text-sm px-1 font-extrabold"
                      to={`/epochs/${Number(formatHexToInt(block.id) + 1)}`}
                    >
                      {'>'}
                    </Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    End Time:
                  </div>
                  <div className="col-span-2">
                    {moment.unix(block.endTime).fromNow()}{' '}
                    {`(${formatDate(timestampToDate(block.endTime))})`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Total Base Reward:
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold">
                      {formatNumberByLocale(
                        numToFixed(
                          WEIToFTM(formatHexToInt(block.totalBaseRewardWeight)),
                          2,
                        ),
                      )}
                    </span>
                    {' FTM'}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Total Fee:
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold">
                      {numToFixed(WEIToFTM(formatHexToInt(block.epochFee)), 2)}
                    </span>
                    {' FTM'}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Total Tx Reward:
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold">
                      {numToFixed(
                        WEIToFTM(formatHexToInt(block.totalTxRewardWeight)),
                        2,
                      )}
                    </span>
                    {' FTM'}
                  </div>
                </td>
              </tr>
            </>
          )}
        </components.DynamicTable>
      </components.TableView>
    </div>
  )
}
