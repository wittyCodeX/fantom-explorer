import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import DonutChart from "react-donut-chart";
import components from "components";
import {
  formatHexToInt,
  numToFixed,
  WEIToFTM,
  formatNumberByLocale,
} from "utils";
import services from "services";

const GET_LAST_EPOCH = gql`
  query LastEpoch($id: Long!) {
    epoch(id: $id) {
      id
      endTime
      duration
      epochFee
      totalSupply
      baseRewardPerSecond
    }
  }
`;
export default function StakingInfo(props) {
  const [lastEpoch, setLastEpoch] = useState([]);
  const [cSelfStacked, setSelfStacked] = useState(0);
  const [cDelegated, setDelegated] = useState(0);
  const [cStaked, setStacked] = useState(0);
  const [dailyReward, setDailyReward] = useState(0);
  const [rewardRate, setCDailyReward] = useState(0);

  const { loading, error, data } = useQuery(GET_LAST_EPOCH, {
    variables: {
      id: "",
    },
  });

  useEffect(() => {
    if (data && props) {
      setSelfStacked(
        numToFixed(
          Number(
            Number(props.selfStaked) /
              WEIToFTM(formatHexToInt(data.epoch.totalSupply))
          ) * 100,
          0
        )
      );
      setDelegated(
        numToFixed(
          (Number(props.totalDelegated) /
            WEIToFTM(formatHexToInt(data.epoch.totalSupply))) *
            100,
          0
        )
      );
      setStacked(
        numToFixed(
          (Number(props.totalStaked) /
            WEIToFTM(formatHexToInt(data.epoch.totalSupply))) *
            100,
          0
        )
      );

      const cDailyRewards =
        Number(WEIToFTM(data.epoch.baseRewardPerSecond)) * 86400;
      setDailyReward(cDailyRewards);
      setCDailyReward(((cDailyRewards * 365) / props.totalStaked) * 100);
      setLastEpoch(data.epoch);
    }
  }, [data]);
  return (
    <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-4 sm:p-0 ">
      <components.DynamicTable title={`Overview`} dontNeedSubtitle={true} classes="mt-5">
        {loading ? (
          <tr>
            <td>
              <components.Loading />
            </td>
          </tr>
        ) : (
          <>
            <tr>
              <td className="flex justify-between border-b md:p-3 p-3">
                <div className="sm:block small text-sm ml-1 ml-sm-0 text-nowrap">
                  Total Self-Staked:
                </div>
                <div className="mr-9 text-sm">
                  <span className="font-bold">
                    {formatNumberByLocale(numToFixed(props?.selfStaked, 2))}
                  </span>{" "}
                  FTM {` (${cSelfStacked} %)`}
                </div>
              </td>
            </tr>
            <tr>
              <td className="flex justify-between border-b md:p-3 p-3">
                <div className="sm:block small text-sm ml-1 ml-sm-0 text-nowrap">
                  Total Delegated:
                </div>
                <div className="mr-9 text-sm">
                  <span className="font-bold">
                    {formatNumberByLocale(numToFixed(props?.totalDelegated, 2))}
                  </span>{" "}
                  FTM{` (${cDelegated} %)`}
                </div>
              </td>
            </tr>
            <tr>
              <td className="flex justify-between border-b md:p-3 p-3">
                <div className="sm:block small text-sm ml-1 ml-sm-0 text-nowrap">
                  Total Staked:
                </div>
                <div className="mr-9 text-sm">
                  <span className="font-bold">
                    {formatNumberByLocale(numToFixed(props?.totalStaked, 2))}
                  </span>{" "}
                  FTM{` (${cStaked} %)`}
                </div>
              </td>
            </tr>
            <tr>
              <td className="flex justify-between border-b md:p-3 p-3">
                <div className="sm:block small text-sm ml-1 ml-sm-0 text-nowrap">
                  Daily Rewards:
                </div>
                <div className="mr-9 text-sm ">
                  {" "}
                  <span className="font-bold">
                    {formatNumberByLocale(numToFixed(dailyReward, 2))}
                  </span>{" "}
                  FTM{" "}
                </div>
              </td>
            </tr>
            <tr>
              <td className="flex justify-between border-b md:p-3 p-3">
                <div className="sm:block small text-sm ml-1 ml-sm-0 text-nowrap">
                  Daily Rewards Rate:
                </div>
                <div className="mr-9 text-sm">
                  {" "}
                  <span className="font-bold">
                    {formatNumberByLocale(numToFixed(rewardRate, 2))}
                  </span>{" "}
                  %{" "}
                </div>
              </td>
            </tr>
          </>
        )}
      </components.DynamicTable>
      <div className=" mt-7">
        <div className="flex flex-row justify-start items-center bg-gray-100 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b">
          <img
            src={services.linking.static("images/totalsupply.svg")}
            alt=""
            srcSet=""
            className="w-5 h-5"
          />
          <span className="text-black dark:text-gray-300 text-md  px-2 font-semibold">
            Token Status
          </span>
        </div>
        <div
          className={`bg-gray-100 dark:bg-[#2c2e3f] flex items-center justify-around xl:flex-row lg:flex-col md:flex-col sm:flex-row flex-col md:w-full py-6`}
        >
          <div className="flex dark:text-gray-100">
            {cStaked && (
              <DonutChart
                data={[
                  { label: "Staked", value: Number(cStaked) },
                  { label: "Delegated", value: 100 - Number(cDelegated) },
                ]}
                className="text-gray-100 innertext-label"
                legend={false}
                height="150"
                width="150"
                colors={["blue", "#ed5083"]}
                strokeColor="#2c2e3f"
              />
            )}
          </div>
          <div className="flex flex-col justify-start my-1">
            <div className="flex flex-col items-center justify-start my-1">
              <div className="text-black dark:text-gray-300 text-sm  flex items-end">
                Total Stacked
              </div>
              <div className="flex items-center ">
                {cStaked && (
                  <components.Number
                    value={numToFixed(props.totalStaked, 2)}
                    classes="text-blue-500 text-lg"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-start my-1">
              <div className="text-black dark:text-gray-300 text-sm  flex items-end">
                Total Delegated
              </div>
              <div className="row-span-2 col-span-2 flex items-center">
                {cDelegated && (
                  <components.Number
                    value={numToFixed(props.totalDelegated, 2)}
                    classes=" text-[#ed5083] text-lg"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-start my-1">
              <div className="text-black dark:text-gray-300 text-sm  flex items-end">
                Total Supply
              </div>
              <div className="row-span-2 col-span-2  flex items-center">
                {data && (
                  <components.Number
                    value={numToFixed(
                      WEIToFTM(formatHexToInt(data.epoch.totalSupply)),
                      2
                    )}
                    classes="text-blue-900 text-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
