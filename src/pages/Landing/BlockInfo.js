import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import DonutChart from "react-donut-chart";
import components from "components";
import services from "services";
import { formatHexToInt, WEIToFTM, numToFixed } from "utils";
const GET_STATE = gql`
  query State {
    state {
      blocks
      transactions
      accounts
      validators
      sfcLockingEnabled
      sealedEpoch {
        id
        totalSupply
        baseRewardPerSecond
      }
    }
  }
`;
const GET_STAKERS = gql`
  query Stakers {
    stakers {
      id
      stakerAddress
      isOffline
      isCheater
      isActive
      createdTime
      stake
      totalStake
      delegatedMe
      downtime
      stakerInfo {
        name
        website
        contact
        logoUrl
      }
    }
  }
`;
export default function BlockInfo() {
  const [totals, setTotals] = useState({
    selfStaked: 0,
    totalDelegated: 0,
    totalStaked: 0
  });
  const [cStaked, setStaked] = useState(0);
  const [cDelegated, setDelegated] = useState(0);

  const queryMultiple = () => {
    const res1 = useQuery(GET_STATE);
    const res2 = useQuery(GET_STAKERS);
    return [res1, res2];
  };

  const [
    { loading: loading1, data: data1 },
    { loading: loading2, data: data2 }
  ] = queryMultiple();

  useEffect(
    () => {
      if (data2) {
        const stakers = data2.stakers;
        const totals = { selfStaked: 0, totalDelegated: 0, totalStaked: 0 };
        let newData = stakers;
        const offline = [];
        const flagged = [];
        const inactive = [];
        let remove = [];

        // shuffle(newData);

        newData.forEach((_item, _idx) => {
          // _item.total_staked = WEIToFTM(_item.stake) + WEIToFTM(_item.delegatedMe);
          totals.selfStaked += parseFloat(numToFixed(WEIToFTM(_item.stake), 0));
          totals.totalDelegated += parseFloat(
            numToFixed(WEIToFTM(_item.delegatedMe), 0)
          );
          totals.totalStaked += parseFloat(
            numToFixed(WEIToFTM(_item.totalStake), 0)
          );
        });
        setStaked(
          numToFixed(
            Number(totals.totalStaked) /
              WEIToFTM(formatHexToInt(data1.state.sealedEpoch.totalSupply)) *
              100,
            0
          )
        );
        setDelegated(
          numToFixed(
            Number(totals.totalDelegated) /
              WEIToFTM(formatHexToInt(data1.state.sealedEpoch.totalSupply)) *
              100,
            0
          )
        );
        setTotals(totals);
      }
    },
    [data2]
  );
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-4 p-4 mt-[50px]">
      <div className="col-span-3 lg:col-span-3 md:col-span-3 bg-gray-100 dark:bg-[#2c2e3f] p-2 border-gray-300 shadow-md order-2  md:order-2 sm:order-2 lg:order-1">
        <div className="flex flex-row items-center justify-start">
          <img
            src={services.linking.static("images/block.svg")}
            alt=""
            srcSet=""
            className="w-5 h-5 m-2"
          />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Chain Data
          </span>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3  grid-cols-1 gap-2">
          <components.Card
            title="Blocks"
            icon={services.linking.static("images/block-9.svg")}
            classes="p-0 "
          >
            <components.Number value={data1 && data1.state.blocks} />
          </components.Card>
          <components.Card
            title="Validators"
            classes="p-0 "
            icon={services.linking.static("images/validator.svg")}
          >
            <components.Number value={data1 && data1.state.validators} />
          </components.Card>
          <components.Card
            title="Transactions"
            classes="p-0 "
            icon={services.linking.static("images/transfer.svg")}
          >
            <components.Number value={data1 && data1.state.transactions} />
          </components.Card>
        </div>
        <div className="grid lg:grid-cols-3  md:grid-cols-3  sm:grid-cols-3  grid-cols-1 gap-2">
          <components.Card
            title="Accounts"
            classes="p-0 "
            icon={services.linking.static("images/user.svg")}
          >
            <components.Number value={data1 && data1.state.accounts} />
          </components.Card>
          <components.Card
            title="Last Epoch"
            classes="p-0 "
            icon={services.linking.static("images/block.svg")}
          >
            <components.Number value={data1 && data1.state.sealedEpoch.id} />
          </components.Card>
          <components.Card
            title="Total Supply"
            classes="p-0 "
            icon={services.linking.static("images/totalsupply.svg")}
          >
            <components.Number
              value={
                data1 &&
                numToFixed(
                  WEIToFTM(formatHexToInt(data1.state.sealedEpoch.totalSupply)),
                  2
                )
              }
            />
          </components.Card>
        </div>
      </div>
      <div className="grid bg-gray-100 dark:bg-[#2c2e3f] col-span-3 md:col-span-1 lg:col-span-1 grid-cols-1 sm:gap-4  w-full p-2 border-gray-300 shadow-md lg:flex md:hidden sm:order-1 lg:order-2  min-w-[200px]">
        <div className="flex flex-col w-full justify-start">
          <div className="flex flex-row items-center justify-start">
            <img
              src={services.linking.static("images/totalsupply.svg")}
              alt=""
              srcSet=""
              className="w-5 h-5 m-2"
            />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Token Status
            </span>
          </div>
          <div
            className={`bg-gray-100 dark:bg-[#2c2e3f] flex items-center justify-around xl:flex-row lg:flex-col md:flex-col sm:flex-row flex-col md:w-full mt-6 m-2 p-2`}
          >
            <div className="flex dark:text-gray-100">
              {data1 &&
                totals &&
                <DonutChart
                  data={[
                    { label: "Staked", value: Number(cStaked) },
                    { label: "Delegated", value: 100 - Number(cDelegated) }
                  ]}
                  className="text-gray-100 innertext-label"
                  legend={false}
                  height="100"
                  width="100"
                  colors={["#9a65ff", "#ed5083"]}
                  strokeColor="#2c2e3f"
                />}
            </div>
            <div className="flex flex-col items-center">
              <div className="col-span-2 title sm:p-0 text-black dark:text-gray-300 text-sm  flex items-end">
                Total Stacked
              </div>
              <div className="row-span-2 col-span-2  flex items-center">
                <components.Number value={totals && totals.totalStaked} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
