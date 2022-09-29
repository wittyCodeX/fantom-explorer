import React from 'react'
import { useQuery, gql } from '@apollo/client'
import components from 'components'

const GET_STATE = gql`
  query State {
    state {
      blocks
      transactions
      accounts
      validators
      sfcLockingEnabled
      sealedEpoch {
        id
        totalSupply
        baseRewardPerSecond
      }
    }
  }
`
export default function BlockInfo() {
  const { loading, error, data } = useQuery(GET_STATE, {
    pollInterval: 1000,
  })
  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-4 p-4 sm:p-0  mt-[50px]">
      <components.Card title="Blocks" className="flex-1 md:p-5 sm:p-1  p-0">
        <components.Number value={data && data.state.blocks} />
      </components.Card>
      <components.Card title="Validators" className="flex-1 md:p-5 sm:p-1 p-0">
        <components.Number value={data && data.state.validators} />
      </components.Card>
      <components.Card title="Accounts" className="flex-1 md:p-5 sm:p-1 p-0">
        <components.Number value={data && data.state.accounts} />
      </components.Card>
      <components.Card
        title="Transactions"
        className="flex-1 md:p-5 sm:p-1 p-0"
      >
        <components.Number value={data && data.state.transactions} />
      </components.Card>
    </div>
  )
}
