import React from 'react'

const Card = (props) => {
  return (
    <div
      className={`flex flex-col bg-white w-24 min-w-full rounded-xl py-8  ${
        props.classes ? props.classes : ''
      }`}
    >
      {props.title ? (
        <div className={'flex items-center justify-center mb-5'}>
          <h1
            className={
              'title p-2 sm:p-0 text-black md:text-2xl sm:text-2xl text-xl'
            }
          >
            {props.title}
          </h1>
        </div>
      ) : (
        ''
      )}
      {props.children}
    </div>
  )
}

export default Card
