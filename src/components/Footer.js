import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { isBrowser } from "react-device-detect";
import services from "services";
import components from "components";
import { numToFixed, getTypeByStr, formatDomainName } from "utils";
import { SocialIcon } from "react-social-icons";

export default function Footer(props) {
  const [isNavOpen, setIsNavOpen] = useState(false); // initiate isNavOpen state with false
  const [price, setPrice] = useState(0);
  const [keywordType, setKeywordType] = useState("all");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const getFTMPrice = async () => {
      fetch(
        "https://api.ftmscan.com/api?module=stats&action=ftmprice&apikey=B7S69ATJVVHDE6NIQC74D9VD3R16NKZSMP"
      )
        .then(res => res.json())
        .then(data => {
          if (data.status === "1") setPrice(data.result.ethusd);
        });
    };
    getFTMPrice();
  }, []);

  const handleChange = _keyword => {
    const type = getTypeByStr(_keyword);
    console.log(type);
    switch (type) {
      case "transaction_hash":
        location.href = "/transactions/" + _keyword;
        break;
      case "address":
        location.href = "/address/" + _keyword;
        break;
      case "block":
        location.href = "/blocks/" + _keyword;
        break;
      case "domain":
        location.href = "/domain/" + formatDomainName(_keyword);
        break;
      default:
        break;
    }
  };
  const onClickSearch = () => {
    const type = getTypeByStr(keyword);
    switch (type) {
      case "transaction_hash":
        location.href = "/transactions/" + keyword;
        break;
      case "address":
        location.href = "/address/" + keyword;
        break;
      case "block":
        location.href = "/blocks/" + keyword;
        break;
      case "domain":
        location.href = "/domain/" + formatDomainName(keyword);
        break;
      default:
        break;
    }
  };
  return (
    <header
      className="sticky top-0 z-30 w-full bg-gray-100 dark:text-gray-300 text-gray-200 px-2 py-4 bg-gray-100 sm:px-4"
      style={{
        backgroundImage: `url(${props.isDarkmode
          ? services.linking.static("images/navbar-bg-dark.png")
          : services.linking.static("images/navbar-bg.png")})`,
        backgroundSize: "cover"
      }}
    >
      <div className="flex items-center flex-col lg:flex-row justify-between mx-auto max-w-6xl">
        <div className="flex flex-row items-center justify-center gap-2">
          <Link
            href="/"
            className="flex flex-row items-center justify-center gap-2"
          >
            <img
              src={services.linking.static("images/fantom-ftm-logo.png")}
              className="h-10 md:h-10 m-auto dark:md:h-10"
              alt="FNS Domains"
            />{" "}
            <span className="font-bold text-md"> Fantom Explorer</span>
          </Link>
        </div>

        <div className="flex justify-end flex-row items-center space-x-1">
          <ul className="space-x-1 flex flex-row">
            <li className="p-1">
              <SocialIcon
                url="https://twitter.com/FantomFDN"
                style={{ height: 25, width: 25 }}
                bgColor="white"
              />
            </li>
            <li className="p-1">
              <SocialIcon
                url="http://chat.fantom.network/"
                network="discord"
                bgColor="white"
                style={{ height: 25, width: 25 }}
              />
            </li>
            <li className="p-1">
              <SocialIcon
                url="https://t.me/Fantom_English"
                style={{ height: 25, width: 25 }}
                bgColor="white"
              />
            </li>
            <li className="p-1">
              <SocialIcon
                url="https://www.reddit.com/r/FantomFoundation/"
                style={{ height: 25, width: 25 }}
                bgColor="white"
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center lg:flex-row flex-col justify-between mx-auto max-w-6xl py-2">
        <div className="flex flex-row items-center justify-center gap-2 md:order-1 order-2">
          <span className="p-2">
            Fantom &copy; {new Date().getFullYear()} All rights reserved
          </span>
        </div>

        <div className="flex justify-end items-center space-x-1 md:order-2 order-1">
          <ul className="space-x-1 md:inline-flex">
            <li>
              <a
                className="block px-2 w-full text-md flex items-center justify-between"
                href="https://fantom.foundation/about/"
                target="_blank"
              >
                <div>About Us</div>
              </a>
            </li>
            <li>
              <a
                className="block px-2 w-full text-md flex items-center justify-between"
                href="https://fantom.foundation/partners/"
                target="_blank"
              >
                <div>Partners and integrations</div>
              </a>
            </li>
            <li>
              <a
                className="block px-2 w-full text-md flex items-center justify-between"
                href="https://fantom.foundation/blog/"
                target="_blank"
              >
                <div>Blog</div>
              </a>
            </li>
            <li>
              <a
                className="block px-2 w-full text-md flex items-center justify-between"
                href="https://fantom.foundation/fantom-faq/"
                target="_blank"
              >
                <div>FAQ</div>
              </a>
            </li>
            <li>
              <a
                className="block px-2 w-full text-md flex items-center justify-between"
                href="https://fantom.foundation/fantom-community/"
                target="_blank"
              >
                <div>Community</div>
              </a>
            </li>
            <li>
              <a
                className="block px-2 w-full text-md flex items-center justify-between"
                href="https://fantom.foundation/careers/"
                target="_blank"
              >
                <div>Careers</div>
              </a>
            </li>
            <li>
              <a
                className="block px-2 w-full text-md flex items-center justify-between"
                href="https://fantom.foundation/careers/"
                target="_blank"
              >
                <div>Media kit</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={`hidden bg-gray-100  dark:bg-[#2c2e3f] dark:text-gray-300 text-black left-0 mt-5 w-full z-10 transition-all`}
      >
        <ul className="flex flex-col items-center justify-between p-2">
          <li>
            <a
              className="block px-2 w-full text-md flex items-center justify-between"
              href="https://fantom.foundation/about/"
              target="_blank"
            >
              <div>About Us</div>
            </a>
          </li>
          <li>
            <a
              className="block px-2 w-full text-md flex items-center justify-between"
              href="https://fantom.foundation/partners/"
              target="_blank"
            >
              <div>Partners and integrations</div>
            </a>
          </li>
          <li>
            <a
              className="block px-2 w-full text-md flex items-center justify-between"
              href="https://fantom.foundation/blog/"
              target="_blank"
            >
              <div>Blog</div>
            </a>
          </li>
          <li>
            <a
              className="block px-2 w-full text-md flex items-center justify-between"
              href="https://fantom.foundation/fantom-faq/"
              target="_blank"
            >
              <div>FAQ</div>
            </a>
          </li>
          <li>
            <a
              className="block px-2 w-full text-md flex items-center justify-between"
              href="https://fantom.foundation/fantom-community/"
              target="_blank"
            >
              <div>Community</div>
            </a>
          </li>
          <li>
            <a
              className="block px-2 w-full text-md flex items-center justify-between"
              href="https://fantom.foundation/careers/"
              target="_blank"
            >
              <div>Careers</div>
            </a>
          </li>
          <li>
            <a
              className="block px-2 w-full text-md flex items-center justify-between"
              href="https://fantom.foundation/careers/"
              target="_blank"
            >
              <div>Media kit</div>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
