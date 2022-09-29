import React from 'react'

const DynamicTable = (props) => {
  return (
    <table className={'relative transition w-full mx-auto text-gray-800'}>
      {props.columns && (
        <thead>
          <tr className="bg-gray-200 ">
            {props.columns.map((column, index) => (
              <td className="p-3" key={index}>
                {column}
              </td>
            ))}
          </tr>
        </thead>
      )}
      <tbody>{props.children}</tbody>
    </table>
  )
}

export default DynamicTable
