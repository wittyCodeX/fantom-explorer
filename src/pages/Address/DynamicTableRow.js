import { Link } from 'react-router-dom'
import { formatHash, formatHexToInt, numToFixed, WEIToFTM } from 'utils'
import moment from 'moment'

export default function DynamicTableRow({ item }) {
  return (
    <tr>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500"
          to={`/transactions/${item.trx.trxHash}`}
        >
          {' '}
          {formatHash(item.trx.trxHash)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">{item.trx.trxType}</td>
      <td className="px-2 text-sm truncate   py-3">
        <div className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap">
          {moment.unix(item.trx.timeStamp).fromNow()}
        </div>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500"
          to={`/address/${item.trx.senderAddress}`}
        >
          {' '}
          {formatHash(item.trx.sender)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <Link
          className="text-blue-500"
          to={`/address/${item.trx.recipientAddress}`}
        >
          {' '}
          {formatHash(item.trx.recipient)}
        </Link>
      </td>
      <td className="px-2 text-sm truncate   py-3">
        {numToFixed(WEIToFTM(item.trx.amount), 2)} FTM
      </td>
      <td className="px-2 text-sm truncate   py-3">
        <span className="text-sm">
          {item.trx.token.name} {`(${item.trx.token.symbol})`}
        </span>
      </td>
    </tr>
  )
}
