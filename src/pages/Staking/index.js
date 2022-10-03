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

export default function Staking() {
  const [validators, setValidators] = useState([]);
  const [totals, setTotals] = useState({
    selfStaked: 0,
    totalDelegated: 0,
    totalStaked: 0,
  });
  const { loading, error, data } = useQuery(GET_STAKERS);

  const columns = [
    "Logo",
    "Name",
    "ID",
    "Address",
    "Downtime",
    "SelfStacked(FTM)",
    "Delegated(FTM)",
    "TotalStacked(FTM)",
  ];

  useEffect(async () => {
    if (data) {
      const stakers = data.stakers;
      const totals = {
        selfStaked: 0,
        totalDelegated: 0,
        totalStaked: 0,
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

      // let convertedData = []
      // newData.forEach(async (_item, idx) => {
      //   let address;
      //   try {
      //     const nameHash = await api.contracts.EVMReverseResolverV1.get(
      //       _item.stakerAddress
      //     );
      //     address = clients.utils.decodeNameHashInputSignals(nameHash);
      //   } catch {
      //     address = _item.stakerAddress;
      //   }
      // convertedData.push({...item, stakerAddress: address})
      // });
      setValidators(newData);
    }
  }, [data]);

  const removeItemsByIndices = (_array = [], _indices = []) => {
    _indices.sort(sortDesc);
    _indices.forEach((_idx) => {
      _array.splice(_idx, 1);
    });
  };
  const sortDesc = (a, b) => {
    return b - a;
  };
  return (
    <div>
      {totals.selfStaked && <StakingInfo {...totals} />}

      <components.TableView
        classes="w-screen max-w-5xl"
        title={`Validators (${validators?.length})`}
        dontNeedSubtitle={true}
      >
        <components.DynamicTable columns={columns}>
          {loading ? (
            <tr>
              <td colSpan={columns?.length}>
                <components.Loading />
              </td>
            </tr>
          ) : (
            validators &&
            validators.map((item, index) => (
              <DynamicTableRow item={item} key={index} />
            ))
          )}
        </components.DynamicTable>
      </components.TableView>
    </div>
  );
}
const DynamicTableRow = ({ item }) => {
  return (
    <tr>
      <td className="px-2 text-sm truncate   py-3">
        <img
          src={
            item.stakerInfo.name !== "Unknown"
              ? item.stakerInfo.logoUrl
              : "https://raw.githubusercontent.com/quan8/FoundationStakingInfo/master/fantomlogo.png"
          }
          alt="logo"
          className="w-7 h-7"
        />
      </td>
      <td className="px-2 text-sm flex flex-row items-center  py-3">
        {item.stakerInfo.name}
        <span>{"  "}</span>
        {item.stakerInfo.name !== "Unknown" && (
          <a
            className="text-blue-500 dark:text-gray-300"
            href={item.stakerInfo.website}
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
              ></path>
            </svg>
          </a>
        )}
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {formatHexToInt(item.id)}
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link className="text-blue-500 dark:text-gray-300" to={`/address/${item.stakerAddress}`}>
          {" "}
          {formatHash(item.stakerAddress)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {formatHexToInt(item.downtime)} s
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {formatNumberByLocale(
          numToFixed(WEIToFTM(formatHexToInt(item.stake)), 2)
        )}{" "}
        FTM
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {formatNumberByLocale(
          numToFixed(WEIToFTM(formatHexToInt(item.delegatedMe)), 2)
        )}{" "}
        FTM
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {formatNumberByLocale(
          numToFixed(WEIToFTM(formatHexToInt(item.totalStake)), 2)
        )}{" "}
        FTM
      </td>
    </tr>
  );
};
