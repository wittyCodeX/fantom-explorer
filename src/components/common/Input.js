import React, { useState } from 'react'

const Input = ({
  name,
  value,
  title,
  placeholder,
  handleChange,
  nativeType,
  required = true,
  className = '',
  disabled = false,
  onInputChange
}) => {
  const onKeyPress = (e) => {
    if (e.charCode == 13) {
      handleChange(e.target.value)
    }
  }
  return (
    <>
      <label className="block mb-0.5 text-gray-700 capitalize" htmlFor={name}>
        <span>{title} </span>
        {required ? (
          <small className={`text-red-600 font-300 capitalize text-sm`}>
            <code>*</code>
          </small>
        ) : (
          ''
        )}
      </label>
      <input
        disabled={disabled}
        value={value}
        autoComplete={title}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
        className={`${className} text-black dark:text-white bg-blue-800 dark:bg-[#2c2e3f]`}
        name={name ? name : title}
        id={title}
        type={nativeType}
        placeholder={placeholder}
      />
    </>
  )
}
export default Input
