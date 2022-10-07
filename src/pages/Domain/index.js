import React, { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import components from "components";
import {
  timestampToDate,
  formatDate,
  domainToAddress,
  WEIToFTM,
  numToFixed,
} from "utils";
import services from "services";

export default function Domain() {
  const params = useParams();
  const [domain, setDomain] = useState([]);
  const [isRedirecting, setRedirecting] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function isRegisterdDomain(name) {
      let address = await domainToAddress(name);
      if (address != "0x0") {
        console.log("redirecting...");
        setAddress(Object.values(address)[0]);
        setRedirecting(true);
      } else {
        const api = services.provider.buildAPI();
        const data = await api.loadDomain(name);
        setDomain(data);
      }
    }
    isRegisterdDomain(params.id);
  }, [params.id]);

  if (isRedirecting) return <Navigate to={`/address/${address}`} />;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row  w-screen max-w-6xl justify-between items-baseline bg-gray-200 dark:bg-[#2c2e3f] dark:text-gray-300 text-xl p-2 border-solid border-grey-light dark:border-blue-light border-b mt-5">
        <div className="text-black  dark:text-gray-300 md:text-2xl sm:text-xl text-sm  px-2 font-medium">
          Domain
        </div>
        <div className="text-black  dark:text-gray-300 text-sm">
          Home {">"} Domains
        </div>
      </div>
      <components.DynamicTable>
        {!domain.domain ? (
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
                  Domain:
                </div>
                <div className="col-span-2">{domain.domain}</div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Status:
                </div>
                <div className="col-span-2">{domain.status}</div>
              </td>
            </tr>
            {domain.status === "AVAILABLE" ? (
              ""
            ) : (
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Owner:
                  </div>
                  <div className="col-span-2">
                    <Link
                      to={`/address/${domain.owner}`}
                      className="text-blue-500 dark:text-gray-300"
                    >
                      {domain.owner}
                    </Link>
                  </div>
                </td>
              </tr>
            )}
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Price in FTM:
                </div>
                <div className="col-span-2 gap-2">
                  <span className="font-bold">
                    {numToFixed(WEIToFTM(domain.priceFTMEstimate), 4)}
                  </span>
                  <span>FTM</span>
                  <span className="text-red-500">
                    {`(${domain.priceUSDCents / 100}$)`}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="grid grid-flow-row-dense grid-cols-3 border-b dark:border-gray-700 p-3">
                <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                  Price in PUMPKIN:
                </div>
                <div className="col-span-2">
                  <span className="font-bold">
                    {domain.pricePumpkinEstimate}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="flex justify-center bg-gray-300 dark:bg-[#2c2e3f] text-blue-500 dark:text-blue-100 border border-blue-300 dark:border-blue-200 p-3">
                <a
                  className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap"
                  href="https://scr-fns-6pa8.vercel.app/"
                  target="_bank"
                >
                  Make your own this domain now:
                </a>
              </td>
            </tr>
          </>
        )}
      </components.DynamicTable>
    </div>
  );
}
