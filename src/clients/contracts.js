import { ethers } from 'ethers'

import _contracts from './lib/contracts/index.js'

const ethersLoader = (signerOrProvider, chainId) => {
  if (!_contracts[chainId]) throw `Contracts not found for chainId ${chainId}`
  const contractData = _contracts[chainId]
  const contracts = {}
  for (let key in contractData.contracts) {
    contracts[key] = new ethers.Contract(
      contractData.contracts[key].address,
      contractData.contracts[key].abi,
      signerOrProvider,
    )
  }

  return {
    getContracts: () => {
      return contracts
    },

    getResolverContract: (address) => {
      const iface = contracts.PublicResolverV1.interface
      return new ethers.Contract(address, iface, signerOrProvider)
    },

    getEVMReverseResolverContract: (address) => {
      const iface = contracts.EVMReverseResolverV1.interface
      return new ethers.Contract(address, iface, signerOrProvider)
    },
  }
}

export default {
  ethersLoader,
}
