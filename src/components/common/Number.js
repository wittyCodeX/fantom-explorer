import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { usePrevious } from 'react-hanger'
export default function Number(props) {
  const [start, setStart] = useState(0)
  const prevCount = usePrevious(start)

  useEffect(() => {
    if (start !== props.value) setStart(props.value)
  }, [props.value, start])

  return (
    <div
      className={`text-4xl md:text-4xl sm:text-3xl text-black text-center  ${
        props.classes ? props.classes : ''
      }`}
    >
      <CountUp start={prevCount} end={props.value} duration={2} separator="," />
    </div>
  )
}
