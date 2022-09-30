import records from './lib/records/records.js'

const RECORDS = records.records.reduce((sum, curr) => {
  sum[curr.name] = curr.key
  return sum
}, {})

RECORDS._standardKeyList = records.records.map((record) => record.key)
RECORDS._LIST = records.records

export default RECORDS
