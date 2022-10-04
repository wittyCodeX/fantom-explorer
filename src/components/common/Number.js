import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { usePrevious } from "react-hanger";
export default function Number(props) {
  const [start, setStart] = useState(0);
  const prevCount = usePrevious(start);

  useEffect(
    () => {
      if (start !== props.value) setStart(props.value);
    },
    [props.value, start]
  );

  return (
    <div
      className={`text-sm font-bold text-black dark:text-gray-300  ${props.classes
        ? props.classes
        : ""}`}
    >
      <CountUp start={prevCount} end={props.value} duration={2} separator="," />
    </div>
  );
}
