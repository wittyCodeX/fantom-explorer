import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import components from "components";
import {
  formatHash,
  formatHexToInt,
  numToFixed,
  WEIToFTM,
  cloneObject,
  formatNumberByLocale,
  addressToDomain
} from "utils";

import services from "services";

import StakingInfo from "./StakingInfo";
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
const columnss = [
  "Logo",
  "Name",
  "ID",
  "Address",
  "Downtime",
  "SelfStacked(FTM)",
  "Delegated(FTM)",
  "TotalStacked(FTM)"
];

const columns = [
  {
    name: "Logo",
    selector: row => row.stakerInfo.logoUrl,
    cell: row =>
      <img
        src={
          row.stakerInfo.name !== "Unknown"
            ? row.stakerInfo.logoUrl
            : "https://raw.githubusercontent.com/quan8/FoundationStakingInfo/master/fantomlogo.png"
        }
        alt="logo"
        className="w-7 h-7"
      />,
    maxWidth: "50px"
  },
  {
    name: "Name",
    selector: row => row.stakerInfo.name,
    cell: row =>
      <div className="px-2 text-sm flex flex-row items-center gap-2 text-black dark:text-gray-300 py-3">
        {row.stakerInfo.name}
        <span>
          {"  "}
        </span>
        {row.stakerInfo.name !== "Unknown" &&
          <a
            className="text-blue-500 dark:text-gray-300"
            href={row.stakerInfo.website}
            target="_blank"
          >
            <svg
              version="1.1"
              viewBox="0 0 512 512"
              className="svg-icon svg-fill w-3 h-3"
            >
              <path
                pid="0"
                d="M432 320h-32a16 16 0 00-16 16v112H64V128h144a16 16 0 0016-16V80a16 16 0 00-16-16H48a48 48 0 00-48 48v352a48 48 0 0048 48h352a48 48 0 0048-48V336a16 16 0 00-16-16zM488 0H360c-21.37 0-32.05 25.91-17 41l35.73 35.73L135 320.37a24 24 0 000 34L157.67 377a24 24 0 0034 0l243.61-243.68L471 169c15 15 41 4.5 41-17V24a24 24 0 00-24-24z"
              />
            </svg>
          </a>}
      </div>,
    sortable: true
  },
  {
    name: "ID",
    selector: row => row.id,
    cell: row =>
      <span className="text-black dark:text-gray-300">
        {formatHexToInt(row.id)}
      </span>,
    maxWidth: "50px",
    sortable: true
  },
  {
    name: "Address",
    selector: row => row.stakerAddress,
    cell: row =>
      <Link
        className="text-blue-500 dark:text-gray-300"
        to={`/address/${row.stakerAddress}`}
      >
        {" "}{formatHash(row.stakerAddress)}
      </Link>
  },
  {
    name: "Downtime",
    selector: row => row.downtime,
    cell: row =>
      <span className="text-black dark:text-gray-300 text-nowrap">
        {formatHexToInt(row.downtime)} s
      </span>,
    maxWidth: "120px",
    sortable: true
  },
  {
    name: "SelfStacked",
    selector: row => row.stake,
    cell: row =>
      <span className="text-black dark:text-gray-300 text-nowrap">
        <span className="font-bold">
          {formatNumberByLocale(
            numToFixed(WEIToFTM(formatHexToInt(row.stake)), 2)
          )}{" "}
        </span>
        FTM
      </span>,
    sortable: true
  },
  {
    name: "Delegated",
    selector: row => row.delegatedMe,
    cell: row =>
      <span className="text-black dark:text-gray-300 text-nowrap">
        <span className="font-bold">
          {formatNumberByLocale(
            numToFixed(WEIToFTM(formatHexToInt(row.delegatedMe)), 2)
          )}{" "}
        </span>
        FTM
      </span>,
    sortable: true
  },
  {
    name: "TotalStacked",
    selector: row => row.totalStake,
    cell: row =>
      <span className="text-black dark:text-gray-300 text-nowrap">
        <span className="font-bold">
          {formatNumberByLocale(
            numToFixed(WEIToFTM(formatHexToInt(row.totalStake)), 2)
          )}{" "}
        </span>
        FTM
      </span>,
    sortable: true
  }
];
export default function Staking() {
  const [validators, setValidators] = useState([]);
  const [totals, setTotals] = useState({
    selfStaked: 0,
    totalDelegated: 0,
    totalStaked: 0
  });
  const { loading, error, data } = useQuery(GET_STAKERS);

  useEffect(
    async () => {
      if (data) {
        const stakers = data.stakers;
        const totals = {
          selfStaked: 0,
          totalDelegated: 0,
          totalStaked: 0
        };
        let newData = stakers;
        const offline = [];
        const flagged = [];
        const inactive = [];
        let remove = [];
        const api = services.provider.buildAPI();

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

          if (!_item.stakerInfo) {
            _item.stakerInfo = {};
          }

          if (!_item.stakerInfo.name) {
            _item.stakerInfo.name = "Unknown";
          }

          if (_item.isOffline && !_item.isCheater) {
            offline.push(_idx);
          }

          if (_item.isCheater) {
            flagged.push(_idx);
          }
        });
        setTotals(totals);
        // offline validators
        if (offline.length > 0) {
          offline.forEach((_idx, _index) => {
            remove.push(_idx);
            offline[_index] = cloneObject(newData[_idx]);
          });
        }

        // flagged validators
        if (flagged.length > 0) {
          flagged.forEach((_idx, _index) => {
            remove.push(_idx);
            flagged[_index] = cloneObject(newData[_idx]);
          });
        }

        if (remove.length > 0) {
          removeItemsByIndices(newData, remove);
        }

        // inactive validators
        remove = [];
        newData.forEach((_item, _idx) => {
          if (!_item.isActive) {
            remove.push(_idx);
            inactive.push(cloneObject(newData[_idx]));
          }
        });

        if (inactive.length > 0) {
          removeItemsByIndices(newData, remove);
        }
        setValidators(newData);
        await formatDomain(newData);
      }
    },
    [data]
  );

  const removeItemsByIndices = (_array = [], _indices = []) => {
    _indices.sort(sortDesc);
    _indices.forEach(_idx => {
      _array.splice(_idx, 1);
    });
  };
  const sortDesc = (a, b) => {
    return b - a;
  };

  const formatDomain = async data => {
    let formatedData = [];

    for (let i = 0; i < data.length; i++) {
      let edgeNew;

      const stakerAddress = await addressToDomain(data[i].stakerAddress);
      edgeNew = {
        ...data[i],
        stakerAddress: stakerAddress
      };

      formatedData.push(edgeNew);
    }
    setValidators(formatedData);
  };
  return (
    <div>
      {totals.selfStaked && <StakingInfo {...totals} />}
      <div className="flex flex-row justify-between items-baseline bg-gray-200 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
        <div className="text-black  dark:text-gray-300 md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          Validators {`(${validators.length})`}
        </div>
      </div>
      {validators &&
        <components.TableView
          classes="w-screen max-w-6xl"
          title="Epochs"
          columns={columns}
          loading={loading}
          data={validators}
          totalCount={validators.length}
          isLocalPagination={true}
        />}
    </div>
  );
}
