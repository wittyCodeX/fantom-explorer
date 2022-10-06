import React from "react";

const Card = props => {
  const handleClick = () => {
    switch (props.title) {
      case "Blocks":
        return (location.href = "/blocks");
      case "Transactions":
        return (location.href = "/transactions");
      case "Validators":
        return (location.href = "/staking");
      case "Last Epoch":
        return (location.href = "/epochs");
    }
  };
  return (
    <div
      className={`bg-gray-100 dark:bg-[#222431] shadow-md m-2 p-4 grid grid-rows-3 grid-flow-col gap-1 cursor-pointer  ${props.classes
        ? props.classes
        : ""}`}
      onClick={handleClick}
    >
      <div className="row-span-3 flex items-center justify-center  dark:text-gray-100">
        <img
          src={props.icon}
          alt="chain-info"
          srcSet=""
          className="w-10 h-10"
        />
      </div>
      <div className="col-span-2 title sm:p-0 text-black dark:text-gray-300 text-sm  flex items-end">
        {props.title}
      </div>
      <div className="row-span-2 col-span-2  flex items-center">
        {props.children}
      </div>
    </div>
  );
};

export default Card;
