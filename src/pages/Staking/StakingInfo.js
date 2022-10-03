import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import {
  formatHash,
  formatHexToInt,
  numToFixed,
  WEIToFTM,
  formatNumberByLocale,
  formatDuration,
} from "utils";
import moment from "moment";

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
    <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-4 p-4 sm:p-0  mt-[10px]">
      <components.TableView title={`Overview`} dontNeedSubtitle={true}>
        <table className="w-full">
          <tbody>
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
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      Total Self-Staked:
                    </div>
                    <div className="mr-9">
                      <span className="font-bold">
                        {formatNumberByLocale(numToFixed(props?.selfStaked, 2))}
                      </span>{" "}
                      FTM {` (${cSelfStacked} %)`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="flex justify-between border-b md:p-3 p-3">
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      Total Delegated:
                    </div>
                    <div className="mr-9">
                      <span className="font-bold">
                        {formatNumberByLocale(
                          numToFixed(props?.totalDelegated, 2)
                        )}
                      </span>{" "}
                      FTM{` (${cDelegated} %)`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="flex justify-between border-b md:p-3 p-3">
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      Total Staked:
                    </div>
                    <div className="mr-9">
                      <span className="font-bold">
                        {formatNumberByLocale(
                          numToFixed(props?.totalStaked, 2)
                        )}
                      </span>{" "}
                      FTM{` (${cStaked} %)`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="flex justify-between border-b md:p-3 p-3">
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      Daily Rewards:
                    </div>
                    <div className="mr-9">
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
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      Daily Rewards Rate:
                    </div>
                    <div className="mr-9">
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
          </tbody>
        </table>
      </components.TableView>
      <components.TableView title={`Last Epoch`} dontNeedSubtitle={true}>
        <table className="w-full">
          <tbody>
            {loading ? (
              <tr>
                <td>
                  <components.Loading />
                </td>
              </tr>
            ) : (
              <>
                <tr>
                  <td className="flex justify-between  border-b p-3">
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      Epoch Number:
                    </div>
                    <div className="col-span-2">
                      {formatHexToInt(lastEpoch.id)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="flex justify-between  border-b p-3">
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      End Time:
                    </div>
                    <div className="col-span-2  break-words">
                      {moment.unix(lastEpoch.endTime).fromNow()}{" "}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="flex justify-between  border-b p-3">
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      Duration:
                    </div>
                    <div className="col-span-2  break-words">
                      {formatDuration(lastEpoch.duration)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="flex justify-between  border-b p-3">
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      Fee:
                    </div>
                    <div className="col-span-2  break-words">
                      {numToFixed(WEIToFTM(lastEpoch.epochFee))} FTM
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="flex justify-between  border-b p-3">
                    <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                      Total Supply:
                    </div>
                    <div className="col-span-2  break-words">
                      {numToFixed(WEIToFTM(formatHexToInt(data.epoch.totalSupply)), 2)} FTM
                    </div>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </components.TableView>
    </div>
  );
}
