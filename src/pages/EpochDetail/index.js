import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import {
  formatHexToInt,
  formatIntToHex,
  timestampToDate,
  numToFixed,
  isObjectEmpty,
  WEIToFTM,
  formatNumberByLocale,
  formatDate,
} from "utils";
import moment from "moment";

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
`;
export default function EpochDetail() {
  const params = useParams();
  const [block, setBlock] = useState([]);
  const { loading, error, data } = useQuery(GET_EPOCH, {
    variables: {
      id: formatIntToHex(params.id),
    },
  });

  useEffect(() => {
    if (data) {
      const epoch = data.epoch;
      setBlock(epoch);
    }
  }, [data]);
  return (
    <div className="flex flex-col w-screen max-w-6xl">
      <div className="flex flex-row justify-between items-baseline bg-gray-200 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
      <div className="text-black flex flex-row gap-2 dark:text-gray-300 md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          <Link
            className="flex-none bg-transparent hover:bg-blue-100 dark:hover:bg-gray-700 text-center text-blue-700 dark:text-gray-300 font-semibold px-3 py-1 border border-blue-500 dark:border-gray-500 rounded text-sm"
            to={`/epochs/${Number(formatHexToInt(block.id) - 1)}`}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          Epoch #{formatHexToInt(block.id)}
          <Link
            className="flex-none bg-transparent hover:bg-blue-100 dark:hover:bg-gray-700 text-center text-blue-700 dark:text-gray-300 font-semibold px-3 py-1 border border-blue-500 dark:border-gray-500 rounded text-sm"
            to={`/epochs/${Number(formatHexToInt(block.id) + 1)}`}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <div className="text-black  dark:text-gray-300 text-sm">
          Home {">"} Epochs {">"} Epoch Detail
        </div>
      </div>
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
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Epoch:
                </div>
                <div className="col-span-2">
                  <span className="font-bold">{formatHexToInt(block.id)}</span>

                  <Link
                    className="bg-gray-200 text-blue-500 text-sm px-1 mx-1 font-extrabold"
                    to={`/epochs/${Number(formatHexToInt(block.id) - 1)}`}
                  >
                    {"<"}
                  </Link>
                  <Link
                    className="bg-gray-200 text-blue-500 text-sm px-1 font-extrabold"
                    to={`/epochs/${Number(formatHexToInt(block.id) + 1)}`}
                  >
                    {">"}
                  </Link>
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  End Time:
                </div>
                <div className="col-span-2">
                  {moment.unix(block.endTime).fromNow()}{" "}
                  {`(${formatDate(timestampToDate(block.endTime))})`}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Total Base Reward:
                </div>
                <div className="col-span-2">
                  <span className="font-bold">
                    {formatNumberByLocale(
                      numToFixed(
                        WEIToFTM(formatHexToInt(block.totalBaseRewardWeight)),
                        2
                      )
                    )}
                  </span>
                  {" FTM"}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Total Fee:
                </div>
                <div className="col-span-2">
                  <span className="font-bold">
                    {numToFixed(WEIToFTM(formatHexToInt(block.epochFee)), 2)}
                  </span>
                  {" FTM"}
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Total Tx Reward:
                </div>
                <div className="col-span-2">
                  <span className="font-bold">
                    {numToFixed(
                      WEIToFTM(formatHexToInt(block.totalTxRewardWeight)),
                      2
                    )}
                  </span>
                  {" FTM"}
                </div>
              </td>
            </tr>
          </>
        )}
      </components.DynamicTable>
    </div>
  );
}
